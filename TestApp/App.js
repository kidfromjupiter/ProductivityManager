import {
	NavigationContainer,
	useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { LogBox, NativeModules } from "react-native";
import { GoogleSignin } from "react-native-google-signin";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Loading from "./src/components/LottieLoading";
import { TopLevelContainer } from "./src/components/TopLevelContainer";
import { Tracker } from "./src/extras/TrackerObject";
import { persistor, store } from "./src/redux/store";
import { logData } from "./src/redux/TrackerSlice";
import Analytics from "./src/screens/Analytics";
import ColorPickerScreen from "./src/screens/ColorPickerScreen";
import HomeScreen from "./src/screens/HomeScreen";
import Pomodoro from "./src/screens/PomodoroScreen";
import ReminderScreen from "./src/screens/ReminderScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import SelectCalendar from "./src/screens/SpacedRep/SelectCalendar";
import CreateEvent from "./src/screens/SpacedRep/SpacedRepCreateEvent";
import SpacedRepHome from "./src/screens/SpacedRep/SpacedRepHome";
import SpacedRepList from "./src/screens/SpacedRep/SpacedRepList";
import TimerScreen from "./src/screens/TimerScreen";

// signIn();

LogBox.ignoreLogs(["Setting a timer", "[react-native-gesture-handler]"]);
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
	UIManager.setLayoutAnimationEnabledExperimental(true);

// signIn().then(() => refreshAccessToken());
GoogleSignin.configure({
	scopes: [
		"https://www.googleapis.com/auth/calendar",
		"https://www.googleapis.com/auth/calendar.events",
	],
	webClientId:
		"828611517945-1j64mv1irokorth2rc4333dm3tctq3hi.apps.googleusercontent.com",
	offlineAccess: true,
	profileImageSize: 120,
});
const Stack = createNativeStackNavigator();

const animation = "fade";

function StackNav() {
	const dispatch = useDispatch();

	return (
		<Stack.Navigator
			initialRouteName="Home"
			screenOptions={{
				headerShown: false,
				gestureEnabled: false,
				animation: animation,
				presentation: "card",
				orientation: "portrait",
				contentStyle: { backgroundColor: "white" },
			}}
		>
			<Stack.Screen
				name="Home"
				component={HomeScreen}
				options={{
					title: "Productivity Manager",
				}}
			/>
			<Stack.Screen name="Timer" component={TimerScreen} />
			<Stack.Screen name="ColorPicker" component={ColorPickerScreen} />
			<Stack.Screen name="Pomodoro" component={Pomodoro} />
			<Stack.Screen name="Reminders" component={ReminderScreen} />
			<Stack.Screen name="Analytics" component={Analytics} />
			<Stack.Screen
				name="CreateEvent"
				component={CreateEvent}
				options={{ animation: "slide_from_right" }}
			/>
			<Stack.Screen name="Settings" component={SettingsScreen} />
			<Stack.Screen name="Spaced Repetition" component={SelectCalendar} />
			<Stack.Screen name="SpacedRepList" component={SpacedRepList} />
			<Stack.Screen name="SpacedRepHome" component={SpacedRepHome} />
		</Stack.Navigator>
	);
}

export default function App() {
	const navigationRef = useNavigationContainerRef();
	const routeNameRef = React.useRef();
	const [currentRouteName, setCurrentRouteName] = React.useState("");

	return (
		<Provider store={store}>
			<PersistGate loading={<Loading />} persistor={persistor}>
				<NavigationContainer
					ref={navigationRef}
					onReady={() => {
						routeNameRef.current = navigationRef.getCurrentRoute().name;
					}}
					onStateChange={() => {
						const previousRouteName = routeNameRef.current;
						const currentRouteName = navigationRef.getCurrentRoute().name;

						if (previousRouteName !== currentRouteName) {
							setCurrentRouteName(currentRouteName);
							store.dispatch(
								logData(new Tracker({ screen: currentRouteName, type: "6" }))
							);
						}
						routeNameRef.current = currentRouteName;
					}}
				>
					<TopLevelContainer
						currentScreen={
							// navigationRef ? navigationRef.getCurrentRoute()?.name : null
							currentRouteName
							// routeNameRef.current
						}
					>
						<StackNav />
					</TopLevelContainer>
				</NavigationContainer>
			</PersistGate>
		</Provider>
	);
}

import { StatusBar } from "expo-status-bar";
import { NativeModules } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import TimerScreen from "./src/screens/TimerScreen";
import { TopLevelContainer, Theme } from "./src/components/TopLevelContainer";
import { Provider } from "react-redux";
import { store, persistor } from "./src/redux/store";
import ReminderScreen from "./src/screens/ReminderScreen";
import Pomodoro from "./src/screens/PomodoroScreen";
import ColorPickerScreen from "./src/screens/ColorPickerScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import CreateEvent from "./src/screens/SpacedRep/SpacedRepCreateEvent";
import AppLoading from "expo-app-loading";
import { PersistGate } from "redux-persist/integration/react";
import SpacedRepHome from "./src/screens/SpacedRep/SpacedRepHome";
import { GoogleSignin } from "react-native-google-signin";
import { useSelector, useDispatch } from "react-redux";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Setting a timer"]);
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
	UIManager.setLayoutAnimationEnabledExperimental(true);

const Stack = createNativeStackNavigator();
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
					// head
				}}
			/>
			<Stack.Screen name="Timer" component={TimerScreen} />
			<Stack.Screen name="ColorPicker" component={ColorPickerScreen} />
			<Stack.Screen name="Pomodoro" component={Pomodoro} />
			<Stack.Screen name="Reminders" component={ReminderScreen} />
			<Stack.Screen
				name="CreateEvent"
				component={CreateEvent}
				options={{ animation: "slide_from_right" }}
			/>
			<Stack.Screen name="Settings" component={SettingsScreen} />
			<Stack.Screen name="Spaced Repetition" component={SpacedRepHome} />
		</Stack.Navigator>
	);
}

export default function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={<AppLoading />} persistor={persistor}>
				<TopLevelContainer>
					<NavigationContainer>
						<StackNav />
					</NavigationContainer>
				</TopLevelContainer>
			</PersistGate>
			<StatusBar style="light" />
		</Provider>
	);
}

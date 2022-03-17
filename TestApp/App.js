import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppLoading from "expo-app-loading";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { LogBox, NativeModules } from "react-native";
import { GoogleSignin } from "react-native-google-signin";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { TopLevelContainer } from "./src/components/TopLevelContainer";
import { persistor, store } from "./src/redux/store";
import ColorPickerScreen from "./src/screens/ColorPickerScreen";
import HomeScreen from "./src/screens/HomeScreen";
import Pomodoro from "./src/screens/PomodoroScreen";
import ReminderScreen from "./src/screens/ReminderScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import CreateEvent from "./src/screens/SpacedRep/SpacedRepCreateEvent";
import SpacedRepHome from "./src/screens/SpacedRep/SpacedRepHome";
import TimerScreen from "./src/screens/TimerScreen";
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

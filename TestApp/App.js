import { StatusBar } from "expo-status-bar";
import * as React from "react";
import {
	Text,
	View,
	Button,
	NativeModules,
	LayoutAnimation,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import TimerScreen from "./src/screens/TimerScreen";
import { TopLevelContainer, Theme } from "./src/components/TopLevelContainer";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import ReminderScreen from "./src/screens/ReminderScreen";
import Pomodoro from "./src/screens/PomodoroScreen";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
	UIManager.setLayoutAnimationEnabledExperimental(true);

// LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

function SettingsScreen() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>Settings!</Text>
		</View>
	);
}

const Stack = createNativeStackNavigator();

const animation = "fade";

function StackNav() {
	return (
		<Stack.Navigator
			initialRouteName="Home"
			screenOptions={{
				headerShown: false,
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
			<Stack.Screen name="Pomodoro" component={Pomodoro} />
			<Stack.Screen name="Reminders" component={ReminderScreen} />
			<Stack.Screen name="Settings" component={SettingsScreen} />
		</Stack.Navigator>
	);
}

export default function App() {
	return (
		<TopLevelContainer>
			<Provider store={store}>
				<NavigationContainer>
					<StackNav />
				</NavigationContainer>
			</Provider>
			<StatusBar style="light" />
		</TopLevelContainer>
	);
}

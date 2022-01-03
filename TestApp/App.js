import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import TimerScreen from "./src/screens/TimerScreen";
import { TopLevelContainer, Theme } from "./src/components/TopLevelContainer";
import { Provider } from "react-redux";
import store from "./src/redux/store";

function SettingsScreen() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>Settings!</Text>
		</View>
	);
}

const Stack = createNativeStackNavigator();

function StackNav() {
	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen
				name="Home"
				component={HomeScreen}
				options={{
					title: "Productivity Manager",
					headerStyle: { backgroundColor: "#323232" },
					headerTitleAlign: "center",
					headerTitleStyle: { color: "white" },
				}}
			/>

			<Stack.Screen
				name="Timer"
				component={TimerScreen}
				options={{ headerShown: false }}
			/>
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
		</TopLevelContainer>
	);
}

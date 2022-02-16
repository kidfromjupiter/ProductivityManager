import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useEffect } from "react";
import { View, Button, NativeModules } from "react-native";
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
import { batchAdd } from "./src/redux/ReminderSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";
import { PersistGate } from "redux-persist/integration/react";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
	UIManager.setLayoutAnimationEnabledExperimental(true);

function SettingsScreen({ navigation }) {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Button
				title="Colors"
				onPress={() => navigation.navigate("ColorPicker")}
			/>
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
			<Stack.Screen name="Settings" component={SettingsScreen} />
		</Stack.Navigator>
	);
}

export default function App() {
	const [loaded, setLoaded] = React.useState(false);
	// useEffect(() => {
	// 	console.log("running app effect");
	// 	async function grab() {
	// 		try {
	// 			const reminders = await AsyncStorage.getItem("reminders");
	// 			const parsed = JSON.parse(reminders);
	// 			store.dispatch(batchAdd({ data: parsed }));
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	}
	// 	grab()
	// 		.then(() => setLoaded(true))
	// 		.then(() => console.log("loaded"));
	// }, []);
	return (
		<TopLevelContainer>
			<Provider store={store}>
				<PersistGate loading={<AppLoading />} persistor={persistor}>
					<NavigationContainer>
						<StackNav />
					</NavigationContainer>
				</PersistGate>
			</Provider>
			<StatusBar style="light" />
		</TopLevelContainer>
	);
}

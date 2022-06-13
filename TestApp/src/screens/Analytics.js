import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Dimensions } from "react-native";
// import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import History from "./Analytics/History";
import OverView from "./Analytics/Overview";
import Today from "./Analytics/Today";
import ScreenTime from "./Analytics/ScreenTime";
import {
	AntDesign,
	Ionicons,
	FontAwesome,
	FontAwesome5,
} from "@expo/vector-icons";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { BlurView } from "expo-blur";
import { getDaily, post_analytics_data } from "../extras/Analytics_backend";
import { default as _ANALYTICS } from "../extras/classes/AnalyticsClass";
import Loading from "../components/LottieLoading";
import LottieView from "lottie-react-native";

const Tab = createBottomTabNavigator();

const Analytics = ({ navigation }) => {
	const colors = useSelector((state) => state.colors);
	const [offset, setOffset] = useState(0);
	const isSignedIn = useSelector((state) => state.gauth.isSignedIn);

	const offsetValue = useSharedValue(0);

	function getWidth() {
		let totalWidth = Dimensions.get("screen").width;
		totalWidth = totalWidth - 20;
		return totalWidth / 4;
	}

	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: offsetValue.value,
				},
			],
		};
	});

	const springConfig = {
		mass: 0.5,
	};
	if (!isSignedIn) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: "black",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<LottieView
					source={require("../../assets/animations/analytics.json")}
					style={{ height: 250, width: 250 }}
					autoPlay
					loop
					speed={1}
				/>
				<Button
					title="Sign in"
					onPress={() => navigation.navigate("Settings")}
				/>
			</View>
		);
	}

	return (
		<>
			<Tab.Navigator
				initialRouteName="Today"
				screenOptions={{
					unmountOnBlur: true,
					// headerShown: false,
					headerStyle: { backgroundColor: colors.levelOne },
					headerTitleStyle: {
						fontSize: 30,
						fontWeight: "bold",
						color: "white",
					},
					tabBarStyle: {
						position: "absolute",
						margin: 10,
						height: 60,
						borderRadius: 10,
						backgroundColor: colors.levelOne,
						borderTopWidth: 0,
					},
					// tabBarActiveTintColor: colors.accentColor,
					tabBarShowLabel: false,
					tabBarBackground: () => {
						return (
							<BlurView
								tint="dark"
								intensity={100}
								style={[StyleSheet.absoluteFill, { borderRadius: 10 }]}
							/>
						);
					},
				}}
				screenListeners={({ navigation, route }) => {
					switch (route.name) {
						case "Today":
							offsetValue.value = withSpring(0, springConfig);
							break;

						case "Overview":
							offsetValue.value = withSpring(getWidth() * 1, springConfig);
							break;
						case "History":
							offsetValue.value = withSpring(getWidth() * 3, springConfig);
							break;
						case "Screentime":
							offsetValue.value = withSpring(getWidth() * 2, springConfig);
						default:
							break;
					}
				}}
			>
				<Tab.Screen
					name="Today"
					options={{
						tabBarIcon: ({ focused, color }) =>
							focused ? (
								<Ionicons
									name="ios-today"
									size={24}
									color={colors.accentColor}
								/>
							) : (
								<Ionicons
									name="ios-today-outline"
									size={24}
									color={colors.levelTwo}
								/>
							),
						headerShown: false,
					}}
					component={Today}
				></Tab.Screen>
				<Tab.Screen
					name="Overview"
					component={OverView}
					options={{
						headerShown: false,
						tabBarIcon: ({ focused, color }) =>
							focused ? (
								<FontAwesome
									name="circle"
									size={24}
									color={colors.accentColor}
								/>
							) : (
								<FontAwesome
									name="circle-o"
									size={24}
									color={colors.levelTwo}
								/>
							),
					}}
				/>
				<Tab.Screen
					name="Screentime"
					component={ScreenTime}
					options={{
						tabBarIcon: ({ focused, color }) =>
							focused ? (
								<FontAwesome
									name="hourglass"
									size={24}
									color={colors.accentColor}
								/>
							) : (
								<FontAwesome
									name="hourglass-o"
									size={24}
									color={colors.levelTwo}
								/>
							),
					}}
				/>
				<Tab.Screen
					options={{
						tabBarIcon: ({ focused, color }) => {
							return focused ? (
								<FontAwesome
									name="history"
									size={24}
									color={colors.accentColor}
								/>
							) : (
								<FontAwesome name="history" size={24} color={colors.levelTwo} />
							);
						},
					}}
					name="History"
					component={History}
				/>
			</Tab.Navigator>
			<Animated.View
				style={[
					{
						height: 2,
						width: getWidth() - 20,
						backgroundColor: colors.accentColor,
						position: "absolute",
						bottom: 70,
						left: 20,

						// borderRadius: 5,
						// right: 0,
					},
					animatedStyles,
				]}
			></Animated.View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default Analytics;

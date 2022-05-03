import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import {
	LineChart,
	BarChart,
	PieChart,
	ProgressChart,
	ContributionGraph,
	StackedBarChart,
} from "react-native-chart-kit";
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

const Tab = createBottomTabNavigator();

const Analytics = ({ navigation }) => {
	const colors = useSelector((state) => state.colors);

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

	function today(params) {
		return (
			<Today
				total_breaktime={analyticsData?.total_breaktime}
				total_sessiontime={analyticsData?.total_sessiontime}
			/>
		);
	}

	return (
		<>
			<Tab.Navigator
				initialRouteName="Today"
				screenOptions={{
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
					}}
					listeners={({ navigation, route }) => ({
						tabPress: (e) => {
							offsetValue.value = withSpring(0, springConfig);
						},
					})}
					component={Today}
				></Tab.Screen>
				<Tab.Screen
					name="Overview"
					component={OverView}
					options={{
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
					listeners={({ navigation, route }) => ({
						tabPress: (e) => {
							offsetValue.value = withSpring(getWidth() * 1, springConfig);
						},
					})}
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
					listeners={({ navigation, route }) => ({
						tabPress: (e) => {
							offsetValue.value = withSpring(getWidth() * 2, springConfig);
						},
					})}
				/>
				<Tab.Screen
					name="ScreenTime"
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
					listeners={({ navigation, route }) => ({
						tabPress: (e) => {
							offsetValue.value = withSpring(getWidth() * 3, springConfig);
						},
					})}
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

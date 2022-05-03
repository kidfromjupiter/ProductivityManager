import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import SpacedRepList from "./SpacedRepList";
import EventCollectionScreen from "./SpacedRepEventCollection";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const Tab = createMaterialBottomTabNavigator();

function SpacedRepHome() {
	const colors = useSelector((state) => state.colors);
	return (
		<Tab.Navigator
			shifting
			barStyle={{ backgroundColor: colors.levelOne }}
			// labeled={false}
			// labelMaxFontSizeMultiplier={1.4
		>
			<Tab.Screen
				name="List"
				options={{
					tabBarIcon: ({ focused, color }) => {
						return focused ? (
							<Entypo name="list" size={24} color={colors.accentColor} />
						) : (
							<Entypo name="list" size={24} color="white" />
						);
					},
					tabBarColor: colors.levelOne,
				}}
				component={SpacedRepList}
			/>
			<Tab.Screen
				name="Events"
				options={{
					tabBarIcon: ({ focused, color }) => {
						return focused ? (
							<AntDesign
								name="appstore1"
								size={24}
								color={colors.accentColor}
							/>
						) : (
							<AntDesign name="appstore1" size={24} color="white" />
						);
					},
					tabBarColor: colors.levelTwo,
					headerShown: true,
				}}
				component={EventCollectionScreen}
			/>
		</Tab.Navigator>
	);
}

export default SpacedRepHome;

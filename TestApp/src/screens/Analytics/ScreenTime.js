import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useSelector } from "react-redux";

const ScreenTime = ({ navigation }) => {
	const colors = useSelector((state) => state.colors);
	return (
		<View
			style={[styles.container, { backgroundColor: colors.backgroundColor }]}
		>
			<Text>ScreenTime</Text>
			<Button
				title="Go to Today"
				onPress={() => navigation.navigate("Today")}
			/>
			<Button
				title="Go to Overview"
				onPress={() => navigation.navigate("OverView")}
			/>
			<Button
				title="Go to History"
				onPress={() => navigation.navigate("History")}
			/>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default ScreenTime;

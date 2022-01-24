import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ReminderList from "../components/ReminderList";
import ActionButton from "../components/ActionButton";
import { useSelector } from "react-redux";

export const ReminderScreen = () => {
	const reminderList = useSelector((state) => state.reminders);
	return (
		<View style={styles.container}>
			<ReminderList DATA={reminderList.reminders} />
			<ActionButton text="Hello" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 2,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default ReminderScreen;

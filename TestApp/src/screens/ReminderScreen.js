import React, { useEffect } from "react";
import { View, Text, StyleSheet, LayoutAnimation } from "react-native";
import { useDispatch } from "react-redux";
import { addReminder } from "../redux/ReminderSlice";
import ReminderList from "../components/ReminderList";
import ActionButton from "../components/ActionButton";
import { useSelector } from "react-redux";
import DialogBox from "../components/DialogBox";
import { ReminderClass } from "../extras/ReminderClass";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ReminderScreen = () => {
	const dispatch = useDispatch();
	const reminderList = useSelector((state) => state.reminders);
	const colors = useSelector((state) => state.colors);
	const [DialogBoxShow, setDialogBoxShow] = React.useState(false);

	const add = (text) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setDialogBoxShow(true);
	};
	const submit = (text, description) => {
		const reminder = new ReminderClass(text, description);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		dispatch(addReminder(reminder.objectify()));
		setDialogBoxShow(false);
	};
	useEffect(() => {
		return () => {
			console.log("running reminder cleanup");
			async function store() {
				try {
					await AsyncStorage.setItem(
						"reminders",
						JSON.stringify(reminderList.reminders),
						(error) => console.log(error)
					);
					console.log("reminderscreen storage item set");
				} catch (error) {
					console.log(error);
				}
			}
			store();
		};
	}, []);

	return (
		<View style={styles.container}>
			<ReminderList DATA={reminderList.reminders} />
			{DialogBoxShow ? (
				<DialogBox
					onCancel={setDialogBoxShow}
					onSubmit={submit}
					isDescription
					color={colors}
				/>
			) : null}
			{DialogBoxShow ? null : <ActionButton text="Hello" onPressOut={add} />}
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

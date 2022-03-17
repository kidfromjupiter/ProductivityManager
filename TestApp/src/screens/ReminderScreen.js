import React from "react";
import { LayoutAnimation, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ActionButton from "../components/ActionButton";
import DialogBox from "../components/DialogBox";
import ReminderList from "../components/ReminderList";
import { ReminderClass } from "../extras/classes/ReminderClass";
import { addReminder } from "../redux/ReminderSlice";


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

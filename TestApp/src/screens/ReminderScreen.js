import React, { useEffect, useState } from "react";
import { LayoutAnimation, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ActionButton from "../components/ActionButton";
import DialogBox from "../components/DialogBox";
import ReminderList from "../components/ReminderList";
import { ReminderClass } from "../extras/classes/ReminderClass";
import { batchAdd } from "../redux/ReminderSlice";

export const ReminderScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	const [reminderList, setReminderList] = useState(
		useSelector((state) => state.reminders.reminders)
	);
	const colors = useSelector((state) => state.colors);
	const [DialogBoxShow, setDialogBoxShow] = React.useState(false);

	const add = (text) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setDialogBoxShow(true);
	};

	function setComplete(index) {
		const localDataList = [...reminderList];
		const completedState = localDataList[index].completed;
		if (completedState == false) {
			const RemovedReminder = localDataList.splice(index, 1);
			RemovedReminder[0].completed = !completedState;
			localDataList.push(RemovedReminder[0]);
		} else {
			localDataList[index].completed = !completedState;
			const toggledReminder = localDataList.splice(index, 1);
			localDataList.unshift(toggledReminder[0]);
		}
		setReminderList(localDataList);
	}
	function deleteItem(index) {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		const localDataList = [...reminderList];
		localDataList.splice(index, 1);
		setReminderList(localDataList);
	}

	const submit = (text, description) => {
		const reminder = new ReminderClass(text, description);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		// let reminders = reminderList ? [...reminderList] : [];
		const reminders = reminderList?.length ? [...reminderList] : [];
		reminders.unshift(reminder.objectify());
		console.log(reminders);
		setReminderList(reminders);
		setDialogBoxShow(false);
	};
	useEffect(() => {
		return () => {
			dispatch(batchAdd({ data: reminderList }));
		};
	}, [reminderList]);

	return (
		<View style={styles.container}>
			<ReminderList
				DATA={reminderList}
				deleteItem={deleteItem}
				setComplete={setComplete}
			/>
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

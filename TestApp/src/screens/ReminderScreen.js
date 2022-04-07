import React, { useEffect, useState } from "react";
import {
	LayoutAnimation,
	StyleSheet,
	View,
	Text,
	Dimensions,
	ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ActionButton from "../components/ActionButton";
import DialogBox from "../components/DialogBox";
import ReminderList from "../components/ReminderList";
import { ReminderClass } from "../extras/classes/ReminderClass";
import { batchAdd } from "../redux/ReminderSlice";

export const ReminderScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	const [completedReminders, setCompletedReminders] = useState(
		useSelector((state) => state.reminders.completed)
	);
	const [onGoingReminder, setOnGoingReminders] = useState(
		useSelector((state) => state.reminders.reminders)
	);
	const colors = useSelector((state) => state.colors);
	const [DialogBoxShow, setDialogBoxShow] = React.useState(false);

	const add = (text) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setDialogBoxShow(true);
	};

	function setComplete(index) {
		const localDataList = [...onGoingReminder];
		const completedState = localDataList[index].completed;

		const selectedReminder = localDataList.splice(index, 1);
		selectedReminder[0].completed = !completedState;

		const completedReminder = [...completedReminders, selectedReminder[0]];
		setCompletedReminders(completedReminder);
		setOnGoingReminders(localDataList);
		// setReminderList([...localDataList, selectedReminder]);

		// localDataList[index].completed = !completedState;
	}
	function setOngoing(index) {
		const localDataList = [...completedReminders];
		const completedState = localDataList[index].completed;

		const selectedReminder = localDataList.splice(index, 1);
		selectedReminder[0].completed = !completedState;

		setCompletedReminders(localDataList);
		setOnGoingReminders([...onGoingReminder, selectedReminder[0]]);

		// setReminderList([...localDataList, selectedReminder]);

		// localDataList[index].completed = !completedState;
	}

	console.log("ongoing", onGoingReminder);

	function deleteItemOngoing(index) {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		const localDataList = [...onGoingReminder];
		localDataList.splice(index, 1);
		setOnGoingReminders(localDataList);
	}
	function deleteItemCompleted(index) {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		const localDataList = [...completedReminders];
		localDataList.splice(index, 1);
		setCompletedReminders(localDataList);
	}

	const submit = (text, description) => {
		const reminder = new ReminderClass(text, description);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		// let reminders = reminderList ? [...reminderList] : [];
		const reminders = onGoingReminder?.length ? [...onGoingReminder] : [];
		reminders.unshift(reminder.objectify());
		setOnGoingReminders(reminders);
		setDialogBoxShow(false);
	};
	useEffect(() => {
		return () => {
			dispatch(
				batchAdd({ reminders: onGoingReminder, completed: completedReminders })
			);
		};
	}, [onGoingReminder, completedReminders]);

	return (
		<View
			style={[styles.container, { backgroundColor: colors.backgroundColor }]}
		>
			<View
				style={[
					{
						backgroundColor: colors.levelOne,
					},
					styles.header,
				]}
			>
				<Text style={styles.headerText}>Reminders</Text>
			</View>
			{/* <ScrollView automaticallyAdjustContentInsets={false}> */}

			<ReminderList
				title="For You"
				DATA={onGoingReminder}
				deleteItem={deleteItemOngoing}
				setComplete={setComplete}
				add={add}
				actionButton
				emptyPrompt
				// customStyles={{ flex: 2 }}
			/>
			<ReminderList
				title="Completed"
				DATA={completedReminders}
				deleteItem={deleteItemCompleted}
				setComplete={setOngoing}
				add={() => {}}
			/>
			{/* </ScrollView> */}
			{DialogBoxShow ? (
				<DialogBox
					onCancel={setDialogBoxShow}
					onSubmit={submit}
					isDescription
					color={colors}
				/>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		// paddingTop: 25,
	},
	headerText: {
		fontSize: 30,
		fontWeight: "bold",
		color: "white",
		padding: 10,
		paddingLeft: 20,
	},
	header: {
		width: Dimensions.get("screen").width,
		height: 100,
		justifyContent: "flex-end",
	},
});

export default ReminderScreen;

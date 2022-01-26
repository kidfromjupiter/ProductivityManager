import React from "react";
import {
	View,
	Text,
	StyleSheet,
	LayoutAnimation,
	NativeModules,
} from "react-native";
import { useDispatch } from "react-redux";
import { addReminder } from "../redux/ReminderSlice";
import ReminderList from "../components/ReminderList";
import ActionButton from "../components/ActionButton";
import { useSelector } from "react-redux";
import DialogBox from "../components/DialogBox";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
	UIManager.setLayoutAnimationEnabledExperimental(true);

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
		const reminder = {
			id: new Date().toJSON(),
			title: text,
			description: description,
			completed: false,
		};
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		dispatch(addReminder(reminder));
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

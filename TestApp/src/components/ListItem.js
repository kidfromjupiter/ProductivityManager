import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch } from "react-redux";
import { editReminder } from "../redux/ReminderSlice";

const ListItem = (props) => {
	console.log("completed state", props.item.completed);
	const dispatch = useDispatch();

	let reminder = Object.assign({}, props.item);

	const setComplete = () => {
		// console.log("before setting checked ", checked);
		// console.log("after setting checked ", checked);
		reminder.completed = !props.item.completed;
		dispatch(editReminder({ reminder: reminder, index: props.index }));
	};

	return (
		<View
			style={styles.outerContainer}
			onTouchEnd={() => {
				setComplete();
			}}
		>
			<View style={styles.innerContainer}>
				<View style={styles.checkboxHolder}>
					<BouncyCheckbox
						onPress={() => {
							setComplete();
						}}
						bounceEffect={1}
						size={30}
						isChecked={props.item.completed}
						disableBuiltInState
						text={props.item.title}
						textStyle={styles.text}
						useNativeDriver
						tou
					/>
				</View>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	outerContainer: {
		flex: 1,
		borderRadius: 10,
		backgroundColor: "#130039",
		height: 100,
		maxHeight: 90,
		flexDirection: "row",
		marginHorizontal: 10,
		marginBottom: 10,
	},
	innerContainer: {
		flex: 1,
		flexDirection: "row",
		// padding: 15,
	},
	checkboxHolder: {
		width: 100,
		flex: 1,
		justifyContent: "center",
		paddingLeft: 15,
	},
	text: {
		fontSize: 17,
		color: "white",
	},
});

export default ListItem;

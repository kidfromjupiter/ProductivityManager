import React from "react";
import {
	View,
	Pressable,
	StyleSheet,
	Text,
	Dimensions,
	Animated,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addReminder } from "../redux/ReminderSlice";

const PressableAnimated = Animated.createAnimatedComponent(Pressable);

const ActionButton = ({ text, icon }) => {
	const dispatch = useDispatch();
	const animatedScale = new Animated.Value(1);

	const onTouchStart = () => {
		Animated.spring(animatedScale, {
			toValue: 0.9,
			useNativeDriver: true,
			speed: 30,
		}).start();
	};

	const onTouchEnd = () => {
		Animated.spring(animatedScale, {
			toValue: 1,
			useNativeDriver: true,
			speed: 10,
		}).start();
	};

	const add = () => {
		console.log("Add reminder");
		const reminder = {
			id: new Date().toJSON(),
			title: "Test",
			description: "Test",
			completed: false,
		};
		dispatch(addReminder(reminder));
	};

	const animatedScaleStyle = {
		transform: [{ scale: animatedScale }],
	};

	return (
		<PressableAnimated
			style={[styles.actionbutton, animatedScaleStyle]}
			onPressIn={() => {
				onTouchStart();
			}}
			onPressOut={() => {
				add();
				onTouchEnd();
			}}
		>
			{icon ? icon : <AntDesign name="plus" size={30} color="white" />}
		</PressableAnimated>
	);
};

const styles = StyleSheet.create({
	actionbutton: {
		position: "absolute",
		zIndex: 1000,
		bottom: 20,
		right: 20,
		backgroundColor: "#ffc484",
		width: 70,
		height: 70,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 40,
		borderWidth: 1,
	},
});
export default ActionButton;

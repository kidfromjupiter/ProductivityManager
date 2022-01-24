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

	const onTouchStart = () => {
		Animated.spring(animatedScale, {
			toValue: 0.9,
			useNativeDriver: true,
			friction: 100,
		}).start(() => onTouchEnd());
	};

	const onTouchEnd = () => {
		Animated.spring(animatedScale, {
			toValue: 1,
			useNativeDriver: true,
			friction: 100,
		}).start(() => add());
		// add();
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
				// onTouchEnd();
				// add();
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
	},
});
export default ActionButton;

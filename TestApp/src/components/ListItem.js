import React, { useState } from "react";
import {
	View,
	Animated,
	StyleSheet,
	NativeModules,
	Pressable,
	Easing,
	LayoutAnimation,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch } from "react-redux";
import { editReminder, deleteReminder } from "../redux/ReminderSlice";
import { AntDesign } from "@expo/vector-icons";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
	UIManager.setLayoutAnimationEnabledExperimental(true);

// const Vector

const ListItem = ({ item, index }) => {
	const animatedValue = new Animated.Value(0);
	const [height, setHeight] = useState(70);

	let expanded = false;

	const arrowAnimation = () => {
		if (expanded == false) {
			Animated.spring(animatedValue, {
				toValue: 1,
				useNativeDriver: true,
				// easing: Easing.quad,
			}).start();
			expanded = true;
			setHeight(height + 20);
		} else {
			Animated.spring(animatedValue, {
				toValue: 0,
				useNativeDriver: true,
				// easing: Easing.quad,
			}).start();
			expanded = false;
			setHeight(height - 20);
		}
	};

	const dispatch = useDispatch();

	const setComplete = () => {
		dispatch(editReminder({ index: index }));
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	};

	const rotationStyle = {
		transform: [
			{
				rotate: animatedValue.interpolate({
					inputRange: [0, 1],
					outputRange: ["0deg", "180deg"],
				}),
			},
		],
	};

	return (
		<Pressable
			style={[
				styles.outerContainer,
				{ backgroundColor: item.completed ? "#6B6B6B" : "#130039" },
			]}
		>
			<View style={styles.innerContainer}>
				<View style={[styles.checkboxHolder, { height: height }]}>
					<BouncyCheckbox
						onPress={() => {
							setComplete();
						}}
						bounceEffect={1}
						size={30}
						isChecked={item.completed}
						disableBuiltInState
						text={item.title}
						textStyle={styles.text}
						useNativeDriver
					/>
				</View>
				<View
					style={styles.expand}
					onTouchEnd={() => {
						dispatch(deleteReminder({ index: index }));
						LayoutAnimation.configureNext(
							LayoutAnimation.Presets.easeInEaseOut
						);
					}}
				>
					<AntDesign name="minus" size={24} color="white" />
				</View>
			</View>
		</Pressable>
	);
};
const styles = StyleSheet.create({
	outerContainer: {
		flex: 1,
		borderRadius: 10,
		backgroundColor: "#130039",
		// height: 70,
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
		height: 70,
		flex: 5,
		justifyContent: "center",
		paddingLeft: 15,
	},
	text: {
		fontSize: 17,
		color: "white",
	},
	expand: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		// display: "none",
	},
});

export default ListItem;

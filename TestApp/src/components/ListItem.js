import React, { useState } from "react";
import {
	View,
	Animated,
	StyleSheet,
	Pressable,
	Easing,
	LayoutAnimation,
	Text,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch } from "react-redux";
import { editReminder, deleteReminder } from "../redux/ReminderSlice";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";

// const Vector

const ListItem = ({ item, index }) => {
	const colors = useSelector((state) => state.colors);
	const animatedValue = new Animated.Value(0);

	const [expanded, setExpanded] = useState(false);

	const dispatch = useDispatch();

	const setComplete = () => {
		dispatch(editReminder({ index: index }));
		setExpanded(false);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	};

	return (
		<Pressable
			style={[
				styles.outerContainer,
				{ backgroundColor: item.completed ? "#6B6B6B" : colors.levelOne },
			]}
		>
			<View style={styles.innerContainer}>
				<View
					style={[
						styles.checkboxHolder,
						{
							height: expanded ? null : 70,
							paddingVertical: expanded ? 15 : null,
						},
					]}
				>
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
						fillColor={colors.accentColor}
						onLongPress={() => {
							setExpanded(!expanded);
							LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
						}}
					/>
					{expanded ? (
						<Text style={styles.descriptionStyle}>{item.description}</Text>
					) : null}
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
		zIndex: 5,
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
	descriptionStyle: {
		fontSize: 13,
		color: "white",
		paddingVertical: 10,
	},
});

export default ListItem;

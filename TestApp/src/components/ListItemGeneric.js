import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	LayoutAnimation,
	TouchableNativeFeedback,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useState } from "react";

const ListItemGeneric = ({
	text,
	Checkbox,
	checkboxColor,
	checkboxTextColor,
	index,
	onCheck,
	isCompleted,
	textColor,
	expandOnLongPress,
	expandHeight,
	height,
	children,
	listItemStyle,
	flex,
}) => {
	const [expanded, setExpanded] = React.useState(false);

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: isCompleted ? "#6B6B6B" : undefined },
				listItemStyle,
				{
					opacity: isCompleted ? 0.5 : null,
					height:
						expanded && expandOnLongPress
							? expandHeight
							: height
							? height
							: flex
							? null
							: 50,
				},
			]}
		>
			{Checkbox ? (
				<BouncyCheckbox
					fillColor={checkboxColor}
					text={text}
					textStyle={{ color: checkboxTextColor }}
					isChecked={isCompleted ? true : false}
					disableBuiltInState
					onPress={() => onCheck(index)}
					useNativeDriver
				/>
			) : (
				<Pressable
					delayLongPress={300}
					hitSlop={2}
					onLongPress={
						expandOnLongPress
							? () => {
									LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
									console.log("expanded");
									setExpanded(!expanded);
							  }
							: null
					}
				>
					<Text style={(styles.textStyle, { color: textColor })}>{text}</Text>
					{children}
				</Pressable>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// backgroundColor: "red",
		height: 50,
		flex: 1,
		justifyContent: "center",
		borderBottomColor: "#8091B0",
		borderBottomWidth: 1,
		paddingLeft: 8,
	},
	textStyle: {
		color: "white",
		backgroundColor: "red",
		flex: 1,
	},
});

export default ListItemGeneric;

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const ListItemGeneric = ({
	text,
	Checkbox,
	checkboxColor,
	checkboxTextColor,
	index,
	onCheck,
	isCompleted,
}) => {
	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: isCompleted ? "#6B6B6B" : null,
					opacity: isCompleted ? 0.3 : null,
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
				<Text>{text}</Text>
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
});

export default ListItemGeneric;

import React from "react";
import {
	LayoutAnimation,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const ListItemGeneric = ({
	text,
	Checkbox,
	checkboxColor,
	checkboxTextColor,
	index,
	onCheck,
	isCompleted,
	textColorLight,
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
					style={{ flex: 1 }}
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
					<Text style={(styles.textStyle, { color: textColorLight })}>
						{text}
					</Text>
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
		paddingLeft: 8,
	},
	textStyle: {
		color: "white",
		backgroundColor: "red",
		flex: 1,
	},
});

export default ListItemGeneric;

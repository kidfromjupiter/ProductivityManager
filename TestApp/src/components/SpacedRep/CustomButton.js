import React from "react";
import { Animated, StyleSheet, Text } from "react-native";

const CustomButton = ({ color, text, callback, textColor, customStyles }) => {
	const animatedButtonScale = new Animated.Value(1);

	const onTouchStart = () => {
		Animated.timing(animatedButtonScale, {
			toValue: 0.95,
			useNativeDriver: true,
			duration: 100,
		}).start(() => onTouchEnd());
	};

	const onTouchEnd = () => {
		Animated.timing(animatedButtonScale, {
			toValue: 1,
			useNativeDriver: true,
			duration: 100,
		}).start(() => callback());
	};
	const animatedScaleStyle = {
		transform: [{ scale: animatedButtonScale }],
		opacity: animatedButtonScale,
	};

	return (
		<Animated.View
			style={[
				styles.button,
				{
					backgroundColor: color,
					marginHorizontal: 0,
					borderRadius: 3,
					marginHorizontal: 3,
				},
				customStyles,
				animatedScaleStyle,
			]}
			onTouchEnd={() => {
				onTouchStart();
			}}
		>
			<Text
				style={[
					styles.buttonText,
					{ color: textColor ? textColor : "black", marginHorizontal: 0 },
				]}
			>
				{text}
			</Text>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	button: {
		flex: 1,
		backgroundColor: "#586781",
		marginHorizontal: 5,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 4,
	},
	buttonText: { fontSize: 17 },
});

export default CustomButton;

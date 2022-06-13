import React from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { View } from "react-native-animatable";

const CustomButton = ({
	color,
	text,
	callback,
	textColorLight,
	customStyles,
	disabled,
	icon,
}) => {
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
		}).start(() => (!disabled ? callback() : null));
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
				{ backgroundColor: disabled ? "grey" : color },
			]}
			onTouchStart={() => {
				onTouchStart();
			}}
		>
			<View style={styles.icon}>{icon ? icon : null}</View>
			<Text
				style={[
					styles.buttonText,
					{
						color: textColorLight ? textColorLight : "black",
						marginHorizontal: 0,
						fontSize: 16,
					},
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
		borderRadius: 6,
		flexDirection: "row",
	},
	buttonText: { fontSize: 17 },
	icon: {
		margin: 7,
	},
});

export default CustomButton;

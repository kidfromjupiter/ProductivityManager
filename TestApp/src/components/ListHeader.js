import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
	Animated,
	LayoutAnimation,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSelector } from "react-redux";

const AnimatedIcon = Animated.createAnimatedComponent(AntDesign);

const ListHeader = ({
	extraStyle,
	text,
	onPressCallback,
	animation,
	iconName,
	iconColor,
	iconSize,
	textStyles,
}) => {
	const animatedValue = new Animated.Value(1);

	const colors = useSelector((state) => state.colors);
	LayoutAnimation.configureNext(animation);
	const onTouchStart = () => {
		Animated.spring(animatedValue, {
			toValue: 0.8,
			useNativeDriver: true,
			mass: 0.1,
		}).start();
	};
	const onTouchEnd = () => {
		Animated.spring(animatedValue, {
			toValue: 1,
			useNativeDriver: true,
			// damping: 10,
			// mass: 1,
		}).start();
	};
	return (
		<View style={[styles.container, extraStyle]}>
			<Text
				style={[
					styles.text,
					{
						color: colors.accentColor,
					},
					textStyles,
				]}
			>
				{text}
			</Text>

			<View style={styles.iconContainer}>
				<Pressable
					onPressIn={() => {
						onTouchStart();
					}}
					onPressOut={() => {
						onTouchEnd();
						onPressCallback();
					}}
				>
					<AnimatedIcon
						name={iconName}
						style={[
							styles.iconStyle,
							{ transform: [{ scale: animatedValue }] },
						]}
						size={!iconSize ? 30 : iconSize}
						color={!iconColor ? colors.accentColor : iconColor}
					/>
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
	text: {
		fontSize: 20,
		fontWeight: "bold",
	},
	iconContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "flex-end",
		paddingRight: 5,
	},
	iconStyle: {
		elevation: 5,
	},
});

export default ListHeader;

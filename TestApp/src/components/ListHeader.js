import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import {
	Animated,
	LayoutAnimation,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import rainbow from "../extras/colors";

import { useSelector } from "react-redux";

const AnimatedIcon = Animated.createAnimatedComponent(AntDesign);

const ListHeader = ({
	extraStyle,
	text,
	onPressCallback,
	titleHoldCallback,
	animation,
	iconName,
	iconColor,
	iconSize,
	textStyles,
	randomiseColor,
}) => {
	const animatedValue = new Animated.Value(1);
	const animatedValueText = new Animated.Value(1);
	const [headerColor, setHeaderColor] = useState(
		rainbow(
			Math.random() * Math.random() * 10,
			Math.random() * Math.random() * 10
		)
	);

	const colors = useSelector((state) => state.colors);
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

	const onTouchStartText = () => {
		Animated.spring(animatedValueText, {
			toValue: 0.8,
			useNativeDriver: true,
			mass: 0.1,
		}).start();
	};
	const onTouchEndText = () => {
		Animated.spring(animatedValueText, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	return (
		<Pressable
			style={[styles.container, extraStyle]}
			onLongPress={titleHoldCallback ? titleHoldCallback : () => {}}
			onPressIn={onTouchStartText}
			onPressOut={onTouchEndText}
		>
			<Animated.Text
				style={[
					styles.text,
					{
						color: randomiseColor ? headerColor : colors.accentColor,
					},
					textStyles,
					{ transform: [{ scale: animatedValueText }] },
				]}
				// onLongPress={titleHoldCallback ? titleHoldCallback : () => {}}
				// onPressIn={() => console.log("pressin")}
				// onPressIn={onTouchStartText}
			>
				{text}
			</Animated.Text>

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
						color={
							!iconColor
								? randomiseColor
									? headerColor
									: colors.accentColor
								: iconColor
						}
					/>
				</Pressable>
			</View>
		</Pressable>
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

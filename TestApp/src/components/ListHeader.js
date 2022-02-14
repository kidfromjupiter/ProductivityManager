import React from "react";
import {
	Text,
	View,
	StyleSheet,
	Animated,
	Pressable,
	LayoutAnimation,
} from "react-native";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";

const AnimatedIcon = Animated.createAnimatedComponent(AntDesign);

const ListHeader = ({ extraStyle, text, onPressCallback, animation }) => {
	const animatedValue = new Animated.Value(1);

	const colors = useSelector((state) => state.colors);
	LayoutAnimation.configureNext(animation);
	const onTouchStart = () => {
		Animated.spring(animatedValue, {
			toValue: 0.8,
			useNativeDriver: true,
			mass: 0.1,
			// damping: 10,
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
	console.log("rendered");
	return (
		<View style={[styles.container, extraStyle]}>
			<Text
				style={[
					styles.text,
					{
						color: colors.accentColor,
					},
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
						name="pluscircle"
						style={[
							styles.iconStyle,
							{ transform: [{ scale: animatedValue }] },
						]}
						size={30}
						color={colors.accentColor}
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

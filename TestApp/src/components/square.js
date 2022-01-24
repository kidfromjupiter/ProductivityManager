import React, { useRef } from "react";
import {
	StyleSheet,
	View,
	Text,
	Pressable,
	TouchableWithoutFeedback,
	Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Gradient = Animated.createAnimatedComponent(LinearGradient);

const Square = (props) => {
	const animatedButtonScale = new Animated.Value(1);

	const onTouchStart = () => {
		Animated.spring(animatedButtonScale, {
			toValue: 0.9,
			useNativeDriver: true,
			damping: 20,
		}).start();
	};

	const onTouchEnd = () => {
		Animated.spring(animatedButtonScale, {
			toValue: 1,
			useNativeDriver: true,
			damping: 10,
		}).start();
		props.navigation.navigate(props.text);
	};

	const animatedScaleStyle = {
		transform: [{ scale: animatedButtonScale }],
	};

	return (
		<Gradient
			colors={[props.startColor, props.endColor]}
			style={[styles.container, { flex: props.flex }, animatedScaleStyle]}
			onTouchStart={() => {
				onTouchStart();
			}}
			onTouchEnd={() => {
				onTouchEnd();
			}}
		>
			<View>
				{!props.children ? <Text style={styles.text}>{props.text}</Text> : null}

				{props.children}
			</View>
		</Gradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		borderRadius: 10,
		width: 100,
		margin: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	rootContainer: {
		flex: 1,
	},
	text: {
		fontSize: 20,
		color: "white",
		// fontWeight: "bold",
	},
	textHolder: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default Square;

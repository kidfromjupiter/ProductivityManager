import React, { useRef } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";
const Square = (props) => {
	const animatedButtonScale = new Animated.Value(1);

	const onTouchStart = () => {
		Animated.spring(animatedButtonScale, {
			toValue: 0.8,
			useNativeDriver: true,
			damping: 8,
		}).start();
	};

	const onTouchEnd = () => {
		Animated.timing(animatedButtonScale, {
			toValue: 1,
			useNativeDriver: true,
			duration: 100,
		}).start(() => props.navigation.navigate(props.text));
	};

	const animatedScaleStyle = {
		transform: [{ scale: animatedButtonScale }],
	};

	return (
		<Animated.View
			// colors={[props.startColor, props.endColor]}
			style={[styles.container, { flex: props.flex }, animatedScaleStyle]}
			onTouchStart={() => {
				onTouchStart();
			}}
			onTouchEnd={() => {
				onTouchEnd();
			}}
		>
			<View style={styles.childrenContainer}>
				{props.showTitle ? <Text style={styles.text}>{props.text}</Text> : null}
				{props.children}
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		borderRadius: 20,
		margin: 6,
		backgroundColor: "#2B3748",
		shadowColor: "black",
		shadowRadius: 2,
		shadowOffset: {
			width: 2,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 8,

		// backgroundColor: "white",
	},
	rootContainer: {
		flex: 1,
	},
	text: {
		fontSize: 20,
		color: "#00D34B",
		fontWeight: "bold",
		padding: 12,
	},
	textHolder: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	childrenContainer: {
		flex: 1,
		flexDirection: "column",
	},
});

export default Square;

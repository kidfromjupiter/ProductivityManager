import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Animated as anim } from "react-native";
import Animated, {
	interpolate,
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
	withRepeat,
	withSpring,
	runOnJS,
} from "react-native-reanimated";
import Modal from "react-native-modal";
import {
	GestureHandlerRootView,
	PanGestureHandler,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";
import notifee from "@notifee/react-native";

const TimesUp = ({ navigation, isVisible, setIsVisible }) => {
	const x = useSharedValue(0);
	const y = useSharedValue(0);
	const swing = useSharedValue(20);
	const pulse = useSharedValue(1);

	useEffect(() => {
		swing.value = withRepeat(withTiming(-10), -1, true);
		pulse.value = withRepeat(withSpring(3), -1, true);
	}, [swing, pulse]);

	const gestureHandler = useAnimatedGestureHandler({
		onActive: (event) => {
			x.value = Math.abs(event.translationX);
			y.value = Math.abs(event.translationY);
		},
		onEnd: (_) => {
			x.value = withTiming(0);
			y.value = withTiming(0);
		},
	});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: (x.value + y.value) / 2 }],
			borderRadius: 1000,
		};
	});

	const animatedButtonStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					scale: interpolate(Math.abs(x.value), [0, 200], [1, 1.05]),
				},
				{ scale: interpolate(Math.abs(y.value), [0, 200], [1, 1.05]) },
			],
			// borderRadius: 1000,
		};
	});

	const animatedIcon = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${swing.value}deg` }],
		};
	});
	const animatedStylePulse = useAnimatedStyle(() => {
		return {
			transform: [{ scale: pulse.value }],
			borderRadius: 1000,
		};
	});
	return (
		<Modal
			isVisible={isVisible}
			coverScreen
			style={{ flex: 1, padding: 0, margin: 0 }}
			animationIn="zoomInUp"
			animationOut="zoomOutDown"
			useNativeDriver
		>
			<LinearGradient
				style={styles.container}
				colors={["#109C82", "#2E32A8"]}
				start={{ x: 1, y: 0.2 }}
				end={{ x: 0, y: 0.8 }}
			>
				<GestureHandlerRootView>
					<View style={styles.topHolder}>
						<Animated.View style={animatedIcon}>
							<MaterialCommunityIcons
								name="bell-ring"
								size={60}
								color="white"
							/>
						</Animated.View>
						<Text style={styles.textStyles}>Ding ding!</Text>
					</View>
					<View style={styles.buttonHolder}>
						<PanGestureHandler
							onGestureEvent={gestureHandler}
							onEnded={(e) => {
								if (
									Math.abs(
										e.nativeEvent.translationX + e.nativeEvent.translationY
									) > 200
								) {
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
									notifee.cancelNotification("timerFinished");
									setIsVisible();
								}
							}}
							// minDist={100}
						>
							<Animated.View style={[styles.holdButton, animatedButtonStyle]}>
								<AntDesign name="close" size={60} color="#FD4D4D" />
							</Animated.View>
						</PanGestureHandler>
						<Animated.View
							style={[styles.opacity, animatedStyle]}
						></Animated.View>
						<Animated.View
							style={[
								styles.opacity,
								{ backgroundColor: "red", height: 50, width: 50 },
								animatedStylePulse,
							]}
						></Animated.View>
					</View>
				</GestureHandlerRootView>
			</LinearGradient>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-evenly",
		alignItems: "center",
		backgroundColor: "#323232",
		borderRadius: 10,
	},
	holdButton: {
		backgroundColor: "white",
		height: 100,
		width: 100,
		borderRadius: 100,
		margin: 10,
		textAlign: "center",
		justifyContent: "center",
		textAlignVertical: "center",
		alignItems: "center",
		elevation: 8,
	},
	opacity: {
		backgroundColor: "#8D8D8D",
		opacity: 0.3,
		height: 10,
		width: 10,
		zIndex: -10,
		position: "absolute",
		// borderRadius: 300,
	},
	buttonHolder: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	topHolder: {
		flex: 1,
		padding: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	textStyles: {
		padding: 30,
		fontSize: 30,
		fontWeight: "bold",
		color: "white",
	},
});

export default TimesUp;

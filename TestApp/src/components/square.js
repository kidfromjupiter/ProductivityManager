import React from "react";
import {
	Animated,
	LayoutAnimation,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
	TapGestureHandler,
} from "react-native-gesture-handler";
import {
	default as RNAnimated,
	Layout,
	runOnJS,
	SequencedTransition,
	useAnimatedGestureHandler,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
	ZoomIn,
	ZoomOut,
} from "react-native-reanimated";

const RNAnimatedPressable = RNAnimated.createAnimatedComponent(Pressable);

const Square = ({
	text,
	flex,
	showTitle,
	enableLongPress,
	children,
	navigation,
	customStyles,
	scaleDown,
	holdToExpand,
	expandSize,
	expanded,
	ParentHoldCallback,
	touchEndCallback,
	titleStyle,
	animationDisabled,
	enteringDelay,
	zoomInDuration,
}) => {
	const animatedButtonScale = new Animated.Value(0);
	const animatedScale = useSharedValue(1);

	const onTouchStart = () => {
		animatedScale.value = withSpring(scaleDown ? scaleDown : 0.8, {
			overshootClamping: true,
			mass: 0.4,
		});
	};
	const onTouchEnd = () => {
		animatedScale.value = withSpring(1, { overshootClamping: true, mass: 0.4 });
	};
	const animatedScaleStyle = useAnimatedStyle(() => {
		return { transform: [{ scale: animatedScale.value }] };
	});

	const tapgesture = Gesture.Tap()
		.onEnd(() => {
			touchEndCallback
				? runOnJS(touchEndCallback)()
				: navigation
				? runOnJS(navigation.navigate)(text)
				: null;
		})
		.onTouchesDown(() => {
			animatedScale.value = withSpring(scaleDown ? scaleDown : 0.8, {
				overshootClamping: true,
				mass: 0.4,
			});
		})
		.onFinalize(() => {
			animatedScale.value = withSpring(1, {
				overshootClamping: true,
				mass: 0.4,
			});
		});

	const longPress = Gesture.LongPress()
		.onEnd(() => {
			enableLongPress
				? () => {
						runOnJS(ParentHoldCallback)();
				  }
				: null;
			// runOnJS(console.log)("long press");
		})
		.onTouchesDown(() => {
			animatedScale.value = withSpring(scaleDown ? scaleDown : 0.8, {
				overshootClamping: true,
				mass: 0.4,
			});
		})
		.onFinalize(() => {
			animatedScale.value = withSpring(1, {
				overshootClamping: true,
				mass: 0.4,
			});
		});
	const gestureHandler = Gesture.Race(tapgesture, longPress);
	// .onEnd((e) => {
	// 	animatedScale.value = withSpring(
	// 		1,
	// 		{ overshootClamping: true, mass: 0.4 },
	// 		() => {
	// 			touchEndCallback
	// 				? runOnJS(touchEndCallback)()
	// 				: navigation
	// 				? runOnJS(navigation.navigate)(text)
	// 				: null;
	// 		}
	// 	);
	// });
	// const tapgesture = useAnimatedGestureHandler({
	// 	onActive: () => {
	// 		animatedScale.value = withSpring(scaleDown ? scaleDown : 0.8, {
	// 			overshootClamping: true,
	// 			mass: 0.4,
	// 		});
	// 		runOnJS(console.log)("fired");
	// 	},
	// 	onEnd: () => {
	// 		animatedScale.value = withSpring(
	// 			1,
	// 			{ overshootClamping: true, mass: 0.4 },
	// 			() => {
	// 				touchEndCallback
	// 					? runOnJS(touchEndCallback)()
	// 					: navigation
	// 					? runOnJS(navigation.navigate)(text)
	// 					: null;
	// 			}
	// 		);
	// 	},
	// });
	const animatedButtonScaleStyle = {
		transform: [{ scale: animatedButtonScale }],
	};

	return (
		<GestureHandlerRootView style={{ flex: flex }}>
			<GestureDetector gesture={gestureHandler}>
				<RNAnimated.View
					delayLongPress={300}
					style={[
						styles.container,
						customStyles,
						holdToExpand && expandSize && expanded ? expandSize : null,
						animatedScaleStyle,
						// animatedButtonScale,
					]}
					entering={ZoomIn.delay(enteringDelay ? enteringDelay : 0).duration(
						!zoomInDuration ? 150 : zoomInDuration
					)}
					exiting={ZoomOut.duration(150)}
					layout={Layout.springify()}
				>
					<View style={styles.childrenContainer}>
						{showTitle ? (
							<Text
								style={[styles.text, titleStyle]}
								numberOfLines={10}
								ellipsizeMode="tail"
							>
								{text}
							</Text>
						) : null}
						{children}
					</View>
				</RNAnimated.View>
			</GestureDetector>
		</GestureHandlerRootView>
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

import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BottomToast from "../components/BottomToast";
import Timer, { Presets } from "../components/Counter";
import dateParser from "../extras/dateparser";
import {
	resetTimer,
	setInitialValue,
	setTimer,
	startTimer,
	toggleRepeat,
} from "../redux/TimerSlice";
import Animated, {
	color,
	useAnimatedProps,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import Svg, {
	Circle,
	Defs,
	Ellipse,
	LinearGradient,
	Rect,
	Stop,
} from "react-native-svg";
import { Feather } from "@expo/vector-icons";

const CIRCLE_LENGTH = 1000;
const R = CIRCLE_LENGTH / (2 * Math.PI);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const TimerScreen = () => {
	const running = useSelector((state) => state.time.isRunning);
	const colors = useSelector((state) => state.colors);
	const timer = useSelector((state) => state.time);
	const timerValue = useSelector((state) => state.time.initialValue);
	const PROGRESS = useSharedValue(0);
	const y = useSharedValue(0);
	const x = useSharedValue(0.5);
	const [layout, setLayout] = useState({ width: 0, height: 0 });
	const dispatch = useDispatch();
	const StartTimer = () => {
		if (timer.time !== 0) {
			dispatch(startTimer());
		}
	};
	const ResetTimer = () => {
		dispatch(resetTimer());
	};
	const SetTimer = (value) => {
		dispatch(setTimer(value));
	};
	useEffect(() => {
		PROGRESS.value = withTiming(timer.time / timerValue);
	}, [timerValue, timer.time]);
	useEffect(() => {
		if (running && !timer.isPaused) {
			y.value = withRepeat(withTiming(0.5, { duration: 5000 }), -1, true);
			x.value = withRepeat(withTiming(2, { duration: 1000 }), -1, true);
		}
	}, [running, timer.isPaused]);

	const animatedProp = useAnimatedProps(() => ({
		strokeDashoffset: CIRCLE_LENGTH * PROGRESS.value,
	}));
	function onLayout(event) {
		const { width, height } = event.nativeEvent.layout;
		setLayout({ width, height });
	}

	const { minutes, seconds } = dateParser(timer.time);

	const animatedGradientProps = useAnimatedProps(() => {
		return {
			y1: y.value,
			x2: x.value,
		};
	});

	return (
		<View
			style={[
				styles.rootContainer,
				{ backgroundColor: colors.backgroundColor },
			]}
		>
			<Svg
				style={{
					position: "absolute",
					left: 0,
					right: 0,
				}}
			>
				<Defs>
					<AnimatedLinearGradient
						id="grad"
						x1="0"
						animatedProps={animatedGradientProps}
						y2="-1"
					>
						<Stop
							offset="0"
							stopColor={colors.backgroundColor}
							stopOpacity="1"
						/>
						<Stop
							offset="1"
							stopColor={colors.accentColor}
							stopOpacity="0.75"
						/>
					</AnimatedLinearGradient>
				</Defs>
				<Rect x={0} y={0} height={height} width={width} fill="url(#grad)" />
			</Svg>
			<View style={styles.progressContainer} onLayout={onLayout}>
				{layout.width != 0 ? (
					<Svg
						style={{
							position: "absolute",
							right: 0,
							left: 0,
							top: 0,
							bottom: 0,
						}}
					>
						<Circle
							cx={layout.width / 2}
							cy={layout.height / 2}
							r={R}
							stroke={colors.levelOne}
							strokeWidth={5}
							transform={`rotate(-90 ${layout.width / 2} ${layout.height / 2})`}
						/>
						<AnimatedCircle
							cx={layout.width / 2}
							cy={layout.height / 2}
							r={R}
							stroke={colors.accentColor}
							strokeWidth={10}
							strokeDasharray={CIRCLE_LENGTH}
							animatedProps={animatedProp}
							strokeLinecap={"round"}
							transform={`rotate(-90 ${layout.width / 2} ${layout.height / 2})`}
						/>
					</Svg>
				) : null}
				<View
					style={{
						position: "absolute",
						right: 0,
						left: 0,
						top: 0,
						bottom: 0,
					}}
				>
					<Timer
						context="timer"
						timeSize={90}
						StartTimer={StartTimer}
						ResetTimer={ResetTimer}
						dispatch={dispatch}
						timer={timer}
						minutes={minutes}
						seconds={seconds}
						setTimer={SetTimer}
						backgroundColor={colors.backgroundColor}
						initialTime={timerValue}
						timerFinishedPopupText="Timer finished!"
					/>
				</View>
			</View>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<TouchableOpacity
					onPress={() => {
						dispatch(toggleRepeat());
					}}
					style={{ padding: 10 }}
				>
					<Feather
						name="repeat"
						size={24}
						color={timer.repeat ? colors.accentColor : "white"}
					/>
				</TouchableOpacity>
			</View>
			<View style={styles.presetHolder}>
				<Presets
					colors={colors}
					resetTimer={ResetTimer}
					setTimer={SetTimer}
					initialTime={(value) =>
						dispatch(setInitialValue({ initialValue: value }))
					}
				/>
			</View>
			{/* {!running ? (
				<BottomToast text="Tap to toggle timer on/off. Hold to reset" />
			) : null} */}
		</View>
	);
};

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: "center",
		zIndex: 10,
		// alignItems: "center",
	},
	progressContainer: {
		paddingBottom: 30,
		flex: 3,
		// backgroundColor: "red",
		// alignItems: "center",
		// textAlignVertical: "center",
		// alignContent: "center",
	},
	presetHolder: {
		flex: 1,
		// backgroundColor: "red",
		// paddingBottom: 50,
	},
});
export default TimerScreen;

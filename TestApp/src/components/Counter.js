import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	Vibration,
	TouchableHighlight,
	LayoutAnimation,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { default as BackgroundTimer } from "react-native-background-timer-android";
import { logData } from "../redux/TrackerSlice";
import { Tracker } from "../extras/TrackerObject";
import { STATUS_CODES } from "../extras/TrackerObject";
import TimesUp from "./TimesUp";
import Notify from "../notifee/test";
import notifee from "@notifee/react-native";
import { getTextColor } from "./CustomReactComponent/ImprovedText";

const Presets = ({ colors, resetTimer, setTimer, initialTime }) => {
	const buttonColor = {
		backgroundColor: colors.accentColor,
	};
	const buttonTextColor = {
		color: "white",
	};
	const textColorLight = {
		color: "#D7D7D7",
	};

	return (
		<>
			<View style={styles.buttonHolder}>
				<TouchableHighlight
					style={[styles.button, buttonColor]}
					onPress={() => {
						resetTimer(0);
						setTimer({ time: 1 * 60 });
						initialTime(1 * 60);
					}}
				>
					<Text style={[styles.textStyles, buttonTextColor]}>1</Text>
				</TouchableHighlight>
				<TouchableHighlight
					style={[styles.button, buttonColor]}
					onPress={() => {
						resetTimer(0);
						setTimer({ time: 2 * 60 });
						initialTime(2 * 60);
					}}
				>
					<Text style={[styles.textStyles, buttonTextColor]}>2</Text>
				</TouchableHighlight>
				<TouchableHighlight
					style={[styles.button, buttonColor]}
					onPress={() => {
						resetTimer(0);
						setTimer({ time: 5 * 60 });
						initialTime(5 * 60);
					}}
				>
					<Text style={[styles.textStyles, buttonTextColor]}>5</Text>
				</TouchableHighlight>
				<TouchableHighlight
					style={[styles.button, buttonColor]}
					onPress={() => {
						resetTimer(0);
						setTimer({ time: 10 * 60 });
						initialTime(10 * 60);
					}}
				>
					<Text style={[styles.textStyles, buttonTextColor]}>10</Text>
				</TouchableHighlight>
			</View>
		</>
	);
};

const Timer = ({
	context,
	isDisabled,
	timeSize,
	StartTimer,
	ResetTimer,
	minutes,
	seconds,
	timer,
	setTimer,
	layoutanimation,
	timerEndCallback,
	backgroundColor,
}) => {
	const colors = useSelector((state) => state.colors);
	const [SOUND, setSOUND] = useState(new Audio.Sound());
	const [playing, setPlaying] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const dispatch = useDispatch();

	Audio.setIsEnabledAsync(true);

	Audio.setAudioModeAsync({
		playsInSilentModeIOS: true,
		shouldDuckAndroid: true,
		staysActiveInBackground: true,
	});

	useEffect(() => {
		const soundTimeout = BackgroundTimer.setTimeout(() => {
			if (timer.isRunning) {
				playSound();
				// setBackgroundTimerSet(true);
			}
		}, timer.time * 1000);
		if (timer && timer.isRunning && timer.time !== 0) {
			const interval = BackgroundTimer.setInterval(() => {
				let newTime = timer.time - 1;
				if (newTime == 0) {
					setTimer({ time: newTime });
					setModalVisible(true);
					Notify("Times Up", "Time is up!");
				}
				setTimer({ time: newTime });
			}, 1000);

			return () => {
				BackgroundTimer.clearInterval(interval);
				BackgroundTimer.clearInterval(soundTimeout);
			};
		}
	}, [timer]);

	async function playSound() {
		SOUND.getStatusAsync().then((e) => {
			if (!e.isPlaying) {
				SOUND.loadAsync(require("../../assets/Phobos.mp3")).then(() => {
					SOUND.setIsLoopingAsync(true);
					SOUND.playAsync();
				});
			}
		});
	}
	useEffect(() => {
		return () => {
			SOUND
				? () => {
						console.log("Unloading Sound");
						SOUND.unloadAsync();
						setPlaying(false);
						// setBackgroundTimerSet(false);
				  }
				: undefined;
		};
	}, [SOUND, playing]);

	useEffect(() => {
		if (modalVisible == false && SOUND) {
			console.log("stopping and unloading Sound");
			SOUND.unloadAsync();
			setPlaying(false);
		}
	}, [modalVisible, SOUND]);

	return (
		<Pressable
			style={[styles.timeContainer]}
			onPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
				LayoutAnimation.configureNext(layoutanimation);
				dispatch(logData(new Tracker({ type: STATUS_CODES.TIMER_TOGGLE })));
				StartTimer();
			}}
			onLongPress={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
				LayoutAnimation.configureNext(layoutanimation);
				ResetTimer();
			}}
			android_ripple={{ color: "grey", borderless: true }}
			disabled={isDisabled || timer.time === 0}
		>
			<View style={{ flex: 8, justifyContent: "center" }}>
				<View>
					<Text
						style={[
							styles.timeStyles,
							context ? { fontSize: timeSize } : { fontSize: 150 },
							{ color: getTextColor(backgroundColor) },
						]}
					>
						{minutes}
					</Text>
				</View>
				<View>
					<Text
						style={[
							styles.timeStyles,
							context ? { fontSize: timeSize } : { fontSize: 150 },
							{ color: getTextColor(backgroundColor) },
						]}
					>
						{seconds}
					</Text>
				</View>
			</View>
			<TimesUp
				isVisible={modalVisible}
				setIsVisible={() => {
					setModalVisible(false);
					timerEndCallback ? timerEndCallback() : null;
				}}
			/>
			{/* {context == "timer" ? (
				<Presets
					colors={colors}
					resetTimer={ResetTimer}
					setTimer={setTimer}
					initialTime={initialTime}
				/>
			) : null} */}
		</Pressable>
	);
};
const styles = StyleSheet.create({
	timeStyles: {
		fontSize: 50,
		color: "white",
		zIndex: 1000,
	},
	rootContainer: {
		flex: 1,
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	timeContainer: {
		justifyContent: "center",
		alignItems: "center",
		zIndex: 2,
		flex: 1,
		// backgroundColor: "black",
	},
	buttonHolder: {
		flex: 3,
		justifyContent: "space-around",
		alignItems: "center",
		flexDirection: "row",
	},
	button: {
		backgroundColor: "#542E0B",
		height: 60,
		width: 60,
		borderRadius: 60,
		margin: 10,
		textAlign: "center",
	},
	textStyles: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		color: "#9D5912",
		fontSize: 30,
		fontWeight: "bold",
		textAlignVertical: "center",
	},
});
export default Timer;
export { Presets };

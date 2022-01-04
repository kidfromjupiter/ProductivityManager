import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	Button,
	TouchableHighlight,
	Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
	setTimer,
	resetTimer,
	startTimer,
	timerFinished,
} from "../redux/TimerSlice";
import dateParser from "../extras/dateparser";
import { Audio } from "expo-av";

const Timer = ({ context, isDisabled }) => {
	const timer = useSelector((state) => state.time);

	const [sound, setSound] = useState();

	async function playSound() {
		console.log("Loading Sound");
		const { sound } = await Audio.Sound.createAsync(require("Phobos.mp3"));
		setSound(sound);

		console.log("Playing Sound");
		await sound.playAsync();
	}

	const dispatch = useDispatch();

	const StartTimer = () => {
		if (timer.time !== 0) {
			dispatch(startTimer());
		}
	};
	const ResetTimer = () => {
		dispatch(resetTimer());
	};

	//playing sounds

	// converting seconds to minutes and seconds
	const { minutes, seconds } = dateParser(timer.time);

	// running the timer for one sec each render and updating the time. clearing the timer when the timer is finished.
	useEffect(() => {
		if (timer.isRunning && timer.time !== 0) {
			const interval = setInterval(() => {
				let newTime = timer.time - 1;
				if (newTime == 0) {
					dispatch(setTimer({ time: newTime }));
					playSound();
				}
				dispatch(setTimer({ time: newTime }));
			}, 1000);

			return () => clearInterval(interval);
		}
	});
	useEffect(() => {
		return sound
			? () => {
					console.log("Unloading Sound");
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	return (
		<Pressable
			style={styles.timeContainer}
			onPress={() => StartTimer()}
			onLongPress={() => ResetTimer()}
			android_ripple={{ color: "grey", borderless: true }}
			disabled={isDisabled}
		>
			<View style={{ flex: 5, justifyContent: "center" }}>
				<View>
					<Text
						style={[
							styles.timeStyles,
							context == "home" ? { fontSize: 50 } : { fontSize: 150 },
						]}
					>
						{minutes}
					</Text>
				</View>
				<View>
					<Text
						style={[
							styles.timeStyles,
							context == "home" ? { fontSize: 50 } : { fontSize: 150 },
						]}
					>
						{seconds}
					</Text>
				</View>
			</View>
			{context !== "home" ? (
				<View style={styles.buttonHolder}>
					<TouchableHighlight
						style={styles.button}
						onPress={() => {
							ResetTimer(0);
							dispatch(setTimer({ time: 1 * 60 }));
						}}
					>
						<Text style={styles.textStyles}>1</Text>
					</TouchableHighlight>
					<TouchableHighlight
						style={styles.button}
						onPress={() => {
							ResetTimer(0);
							dispatch(setTimer({ time: 2 * 60 }));
						}}
					>
						<Text style={styles.textStyles}>2</Text>
					</TouchableHighlight>
					<TouchableHighlight
						style={styles.button}
						onPress={() => {
							ResetTimer(0);
							dispatch(setTimer({ time: 5 * 60 }));
						}}
					>
						<Text style={styles.textStyles}>5</Text>
					</TouchableHighlight>
					<TouchableHighlight
						style={styles.button}
						onPress={() => {
							ResetTimer(0);
							dispatch(setTimer({ time: 10 * 60 }));
						}}
					>
						<Text style={styles.textStyles}>10</Text>
					</TouchableHighlight>
				</View>
			) : null}
		</Pressable>
	);
};
const styles = StyleSheet.create({
	timeStyles: {
		fontSize: 50,
		color: "white",
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
		backgroundColor: "black",
		margin: 20,
	},
	buttonHolder: {
		flex: 3,
		justifyContent: "space-around",
		alignItems: "center",
		flexDirection: "row",
	},
	button: {
		backgroundColor: "#542E0B",
		height: 70,
		width: 70,
		borderRadius: 60,
		margin: 10,
		borderColor: "#884500",
		borderStyle: "solid",
		borderWidth: 1,
		textAlign: "center",
	},
	textStyles: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		color: "#884500",
		fontSize: 30,
		fontWeight: "bold",
		textAlignVertical: "center",
	},
});
export default Timer;

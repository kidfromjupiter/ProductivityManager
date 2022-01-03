import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { resetTimer, setTimer, startTimer } from "../redux/TimerSlice";
import { useFonts } from "@use-expo/font";
import dateParser from "../extras/dateparser";

const Timer = ({ context }) => {
	const timer = useSelector((state) => state.time);
	const [time, setTime] = useState(timer.time);
	const dispatch = useDispatch();

	// converting seconds to minutes and seconds
	const { minutes, seconds } = dateParser(time);

	// running the timer for one sec each render and updating the time. clearing the timer when the timer is finished.
	useEffect(() => {
		if (timer.isRunning) {
			const interval = setInterval(() => {
				setTime(time + 1);
				dispatch(setTimer({ time: time }));
			}, 1000);

			return () => clearInterval(interval);
		}
	});

	const StartTimer = () => {
		console.log("timerStarted. timer toggled.");
		dispatch(startTimer());
	};
	const ResetTimer = () => {
		console.log("timerReset.");
		dispatch(resetTimer());
		setTime(0);
	};

	return (
		<Pressable
			style={styles.timeContainer}
			onPress={() => StartTimer()}
			onLongPress={() => ResetTimer()}
			android_ripple={{ color: "grey", borderless: true }}
		>
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
			{/* <Button onPress={StartTimer} title="Toggle timer" />
			<Button onPress={ResetTimer} title="Reset timer" /> */}
		</Pressable>
	);
};
const styles = StyleSheet.create({
	timeStyles: {
		fontSize: 50,
		color: "white",
	},
	timeContainer: {
		justifyContent: "center",
		alignItems: "center",
		zIndex: 2,
		flex: 2,
		backgroundColor: "black",
		margin: 20,
	},
});
export default Timer;

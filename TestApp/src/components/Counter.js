import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setTimer, resetTimer, startTimer } from "../redux/TimerSlice";
import dateParser from "../extras/dateparser";

const Timer = ({ context, isDisabled }) => {
	const timer = useSelector((state) => state.time);
	console.log("redux time is: ", timer.time);

	const dispatch = useDispatch();

	const StartTimer = () => {
		console.log("timerStarted. timer toggled.");

		dispatch(startTimer());
	};
	const ResetTimer = () => {
		console.log("timerReset.");
		dispatch(resetTimer());
	};

	// converting seconds to minutes and seconds
	const { minutes, seconds } = dateParser(timer.time);

	// running the timer for one sec each render and updating the time. clearing the timer when the timer is finished.
	useEffect(() => {
		if (timer.time == 0) {
			console.log("timerFinished.");
		}
		if (timer.isRunning && timer.time !== 0) {
			const interval = setInterval(() => {
				let newTime = timer.time - 1;
				dispatch(setTimer({ time: newTime }));
			}, 1000);

			return () => clearInterval(interval);
		}
	});

	return (
		<Pressable
			style={styles.timeContainer}
			onPress={() => StartTimer()}
			onLongPress={() => ResetTimer()}
			android_ripple={{ color: "grey", borderless: true }}
			disabled={isDisabled}
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
			{context !== "home" ? (
				<View style={{ flex: 1 }}>
					<Button
						title="1 min"
						onPress={() => {
							ResetTimer(0);
							dispatch(setTimer({ time: 1 * 60 }));
						}}
					/>
					<Button
						title="2 min"
						onPress={() => {
							ResetTimer(0);
							dispatch(setTimer({ time: 2 * 60 }));
						}}
					/>
					<Button
						title="5 min"
						onPress={() => {
							ResetTimer(0);
							dispatch(setTimer({ time: 5 * 60 }));
						}}
					/>
					<Button
						title="10 min"
						onPress={() => {
							ResetTimer(0);
							dispatch(setTimer({ time: 10 * 60 }));
						}}
					/>
				</View>
			) : null}

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
	rootContainer: {
		flex: 1,
		justifyContent: "center",
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
});
export default Timer;

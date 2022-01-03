import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Timer from "../components/Counter";
import BottomToast from "../components/BottomToast";
import { useSelector, useDispatch } from "react-redux";

import { resetTimer, startTimer } from "../redux/TimerSlice";

const TimerScreen = () => {
	const running = useSelector((state) => state.time.isRunning);
	const dispatch = useDispatch();

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
		<View style={styles.rootContainer}>
			<Pressable
				style={styles.timeContainer}
				onPress={() => StartTimer()}
				onLongPress={() => ResetTimer()}
				android_ripple={{ color: "grey", borderless: true }}
			>
				<View style={styles.rootholder}>
					<Timer />
					{!running ? (
						<BottomToast text="Tap to toggle timer on/off. Hold to reset" />
					) : null}
				</View>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	timerholder: {
		flex: 1,
		zIndex: -1,
	},
	timeContainer: {
		justifyContent: "center",
		alignItems: "center",
		zIndex: 2,
		flex: 1,
		backgroundColor: "black",
		margin: 20,
	},
	rootContainer: {
		flex: 1,
		backgroundColor: "black",
	},
});
export default TimerScreen;

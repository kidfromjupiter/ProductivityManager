import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Timer from "../components/Counter";
import BottomToast from "../components/BottomToast";
import { useSelector } from "react-redux";

const TimerScreen = () => {
	const running = useSelector((state) => state.time.isRunning);
	return (
		<View style={styles.rootContainer}>
			<Timer />
			{!running ? (
				<BottomToast text="Tap to toggle timer on/off. Hold to reset" />
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		backgroundColor: "black",
		zIndex: -1,
	},
});
export default TimerScreen;

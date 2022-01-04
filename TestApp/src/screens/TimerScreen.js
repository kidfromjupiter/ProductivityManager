import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Timer from "../components/Counter";
import BottomToast from "../components/BottomToast";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import { resetTimer, startTimer } from "../redux/TimerSlice";

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
	},
});
export default TimerScreen;

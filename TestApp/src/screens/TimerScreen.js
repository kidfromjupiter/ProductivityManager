import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Timer from "../components/Counter";
import BottomToast from "../components/BottomToast";
import { useSelector, useDispatch } from "react-redux";

const TimerScreen = () => {
	const running = useSelector((state) => state.time.isRunning);
	const colors = useSelector((state) => state.colors);

	return (
		<View
			style={[
				styles.rootContainer,
				{ backgroundColor: colors.backgroundColor },
			]}
		>
			<Timer context="timer" timeSize={150} />
			{!running ? (
				<BottomToast text="Tap to toggle timer on/off. Hold to reset" />
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
	},
});
export default TimerScreen;

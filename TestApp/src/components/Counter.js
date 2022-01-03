import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setTimer } from "../redux/TimerSlice";
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

	return (
		<View style={styles.rootContainer}>
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
		</View>
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
});
export default Timer;

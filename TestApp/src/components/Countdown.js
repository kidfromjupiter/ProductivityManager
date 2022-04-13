import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableHighlight,
	Vibration,
	LayoutAnimation,
	TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { default as BackgroundTimer } from "react-native-background-timer-android";
import moment from "moment";
import { setDeadline } from "../redux/DeadlineSlice";

const DigitContainer = ({ digit, text }) => {
	const colors = useSelector((state) => state.colors);
	return (
		<View style={[styles.digitContainer, { backgroundColor: colors.levelTwo }]}>
			<Text style={[styles.textStyles, { color: colors.textColor }]}>
				{digit < 10 ? "0" + digit : digit}
			</Text>
			<Text style={{ color: colors.textColor, paddingBottom: 5 }}>{text}</Text>
			<View
				style={{
					position: "absolute",
					height: 2,
					backgroundColor: "white",
					width: 75,
					zIndex: -10,
					opacity: 0.09,
				}}
			></View>
		</View>
	);
};

export default function CountDown() {
	const today = new Date();
	// const timeLeft = new Date(deadlineTime) - today.getTime();
	const deadline = useSelector((state) => state.deadline.deadline);
	const [time, setTime] = useState(new Date(deadline) - today.getTime());
	const dispatch = useDispatch();

	useEffect(() => {
		const interval = BackgroundTimer.setInterval(() => {
			const newTime = time - 1000;
			setTime(newTime);
		}, 1000);

		return () => {
			BackgroundTimer.clearInterval(interval);
		};
	}, [time]);

	useEffect(() => {
		const timeLeft = new Date(deadline) - today.getTime();
		setTime(timeLeft);
	}, [deadline]);

	const d = moment.duration(time);
	function gettime() {
		const days = Math.floor(d.asDays() % 30);
		const hours = Math.floor(d.asHours() % 24);
		const minutes = Math.floor(d.asMinutes() % 60);
		const seconds = Math.floor(d.asSeconds() % 60);
		if (seconds < 0) {
			return { days: 0, hours: 0, minutes: 0, seconds: 0 };
		}
		return { days: days, hours: hours, minutes: minutes, seconds: seconds };
	}

	const parsedTime = gettime();

	return (
		<View style={{ flex: 3, justifyContent: "center" }}>
			<Text
				style={{
					color: "white",
					textAlign: "center",
					paddingBottom: 15,
					fontSize: 17,
				}}
			>
				Time till deadline
			</Text>
			<View style={styles.container}>
				<DigitContainer digit={parsedTime.days} text="Days" />
				<DigitContainer digit={parsedTime.hours} text="Hours" />
				<DigitContainer digit={parsedTime.minutes} text="Minutes" />
				<DigitContainer digit={parsedTime.seconds} text="Seconds" />
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		// height: 190,
		paddingHorizontal: 20,
		justifyContent: "space-around",
		flexDirection: "row",
		alignItems: "center",
	},
	textStyles: {
		fontSize: 50,
		color: "white",
		textAlign: "center",
		textAlignVertical: "center",
	},
	digitContainer: {
		height: 90,
		// width: 65,
		padding: 10,
		backgroundColor: "red",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
});

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import dateParser from "../extras/dateparser";
import { View } from "react-native";
import { StyleSheet } from "react-native";
import Square from "../components/square";
import { useSelector } from "react-redux";
import Timer from "../components/Counter";
import { MiniReminderView } from "../components/MiniReminderView";
import { setTimer, resetTimer, startTimer } from "../redux/TimerSlice";

function HomeScreen({ navigation }) {
	const timer = useSelector((state) => state.time);
	const color = useSelector((state) => state.colors);

	const dispatch = useDispatch();

	const StartTimer = () => {
		if (timer.time !== 0) {
			dispatch(startTimer());
		}
	};
	const ResetTimer = () => {
		dispatch(resetTimer());
	};
	const SetTimer = (value) => {
		dispatch(setTimer(value));
	};

	const { minutes, seconds } = dateParser(timer.time);
	return (
		<View
			style={[styles.rootContainer, { backgroundColor: color.backgroundColor }]}
		>
			<View style={styles.container}>
				<Square
					flex={5}
					text="Pomodoro"
					startColor="#9D50BB"
					endColor="#6E48AA"
					navigation={navigation}
					showTitle
					customStyles={{ backgroundColor: color.levelOne }}
					titleStyle={{ color: color.accentColor }}
				/>
				<Square
					flex={3}
					text="Timer"
					startColor="#00143D"
					endColor="#00257A"
					navigation={navigation}
					customStyles={{ backgroundColor: color.levelOne }}
					titleStyle={{ color: color.accentColor }}
				>
					<Timer
						context="home"
						timeSize={65}
						isDisabled
						StartTimer={StartTimer}
						ResetTimer={ResetTimer}
						timer={timer}
						minutes={minutes}
						seconds={seconds}
						setTimer={SetTimer}
					/>
				</Square>
			</View>
			<View style={styles.container}>
				<View>
					<Square
						flex={1}
						text="Settings"
						startColor="#5BD5F0"
						endColor="#3a7bd5"
						navigation={navigation}
						showTitle
						customStyles={{ backgroundColor: color.levelOne }}
						titleStyle={{ color: color.accentColor }}
					/>
				</View>
				<Square
					flex={1}
					text="Stats"
					endColor="#ff5858"
					startColor="#D33E30"
					navigation={navigation}
					showTitle
					customStyles={{ backgroundColor: color.levelOne }}
					titleStyle={{ color: color.accentColor }}
				/>
			</View>
			<View style={styles.container}>
				<Square
					flex={1}
					text="Reminders"
					endColor="#00BFB6"
					startColor="#0055BF"
					navigation={navigation}
					showTitle
					customStyles={{ backgroundColor: color.levelOne }}
					titleStyle={{ color: color.accentColor }}
					iconName="pluscircle"
				>
					<MiniReminderView />
				</Square>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
	},
	rootContainer: {
		flex: 1,
		backgroundColor: "#191F2C",
		paddingTop: 30,
	},
});
export default HomeScreen;

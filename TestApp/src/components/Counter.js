import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	TouchableHighlight,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Audio } from "expo-av";

const Presets = ({ colors, resetTimer, dispatch, setTimer }) => {
	const buttonColor = {
		backgroundColor: colors.accentColor,
	};
	const buttonTextColor = {
		color: "white",
	};
	const textColor = {
		color: "#D7D7D7",
	};
	return (
		<>
			<View style={styles.buttonHolder}>
				<TouchableHighlight
					style={[styles.button, buttonColor]}
					onPress={() => {
						resetTimer(0);
						setTimer({ time: 1 * 60 });
					}}
				>
					<Text style={[styles.textStyles, buttonTextColor]}>1</Text>
				</TouchableHighlight>
				<TouchableHighlight
					style={[styles.button, buttonColor]}
					onPress={() => {
						resetTimer(0);
						setTimer({ time: 2 * 60 });
					}}
				>
					<Text style={[styles.textStyles, buttonTextColor]}>2</Text>
				</TouchableHighlight>
				<TouchableHighlight
					style={[styles.button, buttonColor]}
					onPress={() => {
						resetTimer(0);
						setTimer({ time: 5 * 60 });
					}}
				>
					<Text style={[styles.textStyles, buttonTextColor]}>5</Text>
				</TouchableHighlight>
				<TouchableHighlight
					style={[styles.button, buttonColor]}
					onPress={() => {
						resetTimer(0);
						setTimer({ time: 10 * 60 });
					}}
				>
					<Text style={[styles.textStyles, buttonTextColor]}>10</Text>
				</TouchableHighlight>
			</View>
		</>
	);
};

const Timer = ({
	context,
	isDisabled,
	timeSize,
	StartTimer,
	ResetTimer,
	minutes,
	seconds,
	timer,
	setTimer,
}) => {
	const colors = useSelector((state) => state.colors);
	const [sound, setSound] = useState();

	useEffect(() => {
		if (timer && timer.isRunning && timer.time !== 0) {
			const interval = setInterval(() => {
				let newTime = timer.time - 1;
				if (newTime == 0) {
					setTimer({ time: newTime });
					playSound();
				}
				setTimer({ time: newTime });
			}, 1000);

			return () => clearInterval(interval);
		}
	});
	async function playSound() {
		console.log("Loading Sound");
		const { sound } = await Audio.Sound.createAsync(
			require("../../assets/Phobos.mp3")
		);
		setSound(sound);

		console.log("Playing Sound");
		await sound.playAsync();
	}
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
			style={[
				styles.timeContainer,
				// { backgroundColor: context == "home" ? null : colors.backgroundColor },
			]}
			onPress={() => StartTimer()}
			onLongPress={() => ResetTimer()}
			android_ripple={{ color: "grey", borderless: true }}
			disabled={isDisabled || timer.time === 0}
		>
			<View style={{ flex: 8, justifyContent: "center" }}>
				<View>
					<Text
						style={[
							styles.timeStyles,
							context ? { fontSize: timeSize } : { fontSize: 150 },
						]}
					>
						{minutes}
					</Text>
				</View>
				<View>
					<Text
						style={[
							styles.timeStyles,
							context ? { fontSize: timeSize } : { fontSize: 150 },
						]}
					>
						{seconds}
					</Text>
				</View>
			</View>
			{context == "timer" ? (
				<Presets colors={colors} resetTimer={ResetTimer} setTimer={setTimer} />
			) : null}
		</Pressable>
	);
};
const styles = StyleSheet.create({
	timeStyles: {
		fontSize: 50,
		color: "white",
		zIndex: 1000,
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
		// backgroundColor: "black",
	},
	buttonHolder: {
		flex: 3,
		justifyContent: "space-around",
		alignItems: "center",
		flexDirection: "row",
	},
	button: {
		backgroundColor: "#542E0B",
		height: 60,
		width: 60,
		borderRadius: 60,
		margin: 10,
		textAlign: "center",
	},
	textStyles: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		color: "#9D5912",
		fontSize: 30,
		fontWeight: "bold",
		textAlignVertical: "center",
	},
});
export default Timer;

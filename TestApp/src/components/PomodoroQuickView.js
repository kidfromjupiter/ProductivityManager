import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CircularProgressWithChild } from "react-native-circular-progress-indicator";
import { useDispatch, useSelector } from "react-redux";
import rainbow from "../extras/colors";
import ImprovedText, {
	getTextColor,
} from "./CustomReactComponent/ImprovedText";

const PomodoroQuickView = ({}) => {
	const colors = useSelector((state) => state.colors);
	const pomodoro = useSelector((state) => state.pomodoro);
	const [progress, setProgress] = useState(0);
	const [timeProgress, setTimeProgress] = useState(0);

	useEffect(() => {
		setProgress(
			((pomodoro.numOfTotalSessions - pomodoro.cycleData.length) /
				pomodoro.numOfTotalSessions) *
				100
		);
		setTimeProgress(
			((pomodoro.initialTime - pomodoro.time) / pomodoro.initialTime) * 100
		);
	}, [pomodoro]);

	return (
		<View style={[styles.container]}>
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<CircularProgressWithChild
					value={timeProgress}
					radius={50}
					activeStrokeColor={colors.levelFour}
				>
					<CircularProgressWithChild
						value={progress}
						radius={40}
						activeStrokeColor={colors.levelFour}
					>
						<ImprovedText
							backgroundColor={colors.levelTwo}
							text={Math.round(pomodoro.time / 60)}
							style={{ fontWeight: "bold", fontSize: 18 }}
						/>
					</CircularProgressWithChild>
				</CircularProgressWithChild>
			</View>

			<View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
				{pomodoro.cycleData.length > 0 ? (
					<>
						<Text
							style={{
								fontSize: 18,
								// textAlign: "right",
								padding: 10,
								fontWeight: "bold",
								backgroundColor: colors.levelThree,
								borderRadius: 10,
								color: getTextColor(colors.levelThree),
								// flex: 1,
							}}
							numberOfLines={1}
						>
							{pomodoro.pomodoroName}
						</Text>
						<ImprovedText
							text={
								Math.round(pomodoro.cycleData.length / 2) + " sessions left"
							}
							backgroundColor={colors.levelTwo}
							style={{ fontSize: 14, paddingVertical: 10 }}
						/>
					</>
				) : (
					<ImprovedText
						text={"Lets get to work"}
						backgroundColor={colors.levelThree}
						style={{
							fontSize: 20,
							// textAlign: "right",
							padding: 10,
							fontWeight: "bold",
							backgroundColor: colors.levelThree,
							borderRadius: 10,
							// flex: 1,
						}}
					/>
				)}
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginBottom: 5,
		marginHorizontal: 5,
		borderRadius: 20,
		flexDirection: "row",
		padding: 5,
	},
});

export default PomodoroQuickView;

import React from "react";
import InfoCircle from "./Circle";
import { View, Text, StyleSheet } from "react-native";

const PomodoroPresetContainer = ({
	colors,
	totalTime,
	sessionTime,
	breakTime,
	title,
	numOfSessions,
	touchEndCallback,
}) => {
	return (
		<View style={styles.PresetInfoContainer} onTouchStart={touchEndCallback}>
			<View
				style={[
					styles.Presets,
					styles.PresetTop,
					{ borderBottomColor: colors.backgroundColor },
				]}
			>
				<InfoCircle
					number={sessionTime}
					numberSize={30}
					setRadius
					radius={70}
					color={colors.accentColor}
					customStyles={[styles.circleStyle]}
					textColor={colors.textColorTwo}
					text="min"
					adjustMargin={-10}
					backgroundColor={colors.levelThree}
				/>
				<Text style={[styles.titleText, { color: colors.textColorTwo }]}>
					Session
				</Text>
			</View>
			<View style={[styles.Presets, styles.PresetMiddle]}>
				<InfoCircle
					number={breakTime}
					numberSize={15}
					setRadius
					radius={50}
					backgroundColor={colors.levelThree}
					color={colors.accentColor}
					customStyles={[styles.circleStyle]}
					textColor={colors.textColorTwo}
					text="min"
					textSize={12}
					adjustMargin={-5}
				/>
				<Text style={[styles.titleText, { color: colors.textColorTwo }]}>
					Break
				</Text>
			</View>
			<View
				style={[
					styles.Presets,
					styles.PresetBottom,
					{ backgroundColor: colors.levelThree },
				]}
			>
				<Text
					style={[
						styles.titleText,
						styles.BottomText,
						{
							color: "black",
							backgroundColor: colors.textColor,
							paddingHorizontal: 30,
							paddingVertical: 2,
							borderRadius: 10,
						},
					]}
				>
					{title.length > 8 ? title.slice(0, 8) + "..." : title}
				</Text>
				<View style={{ flexDirection: "row" }}>
					<Text
						style={[
							styles.titleText,
							styles.BottomText,
							styles.BottomBottomText,
							{ color: colors.textColorTwo },
						]}
					>
						{numOfSessions} sessions
					</Text>
					<Text
						style={[
							styles.titleText,
							styles.BottomText,
							styles.BottomBottomText,
							{ color: colors.textColorTwo },
						]}
					>
						Total : {totalTime}min
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	Presets: {
		justifyContent: "space-around",
		alignItems: "center",
		flexDirection: "row",
	},
	PresetTop: {
		flex: 4,
		alignItems: "center",
		borderBottomWidth: 1,
	},
	PresetMiddle: {
		flex: 3,
	},
	PresetBottom: {
		flex: 3,
		flexDirection: "column",
	},
	circleStyle: {
		borderWidth: 3,
	},
	titleText: {
		fontSize: 25,
		fontWeight: "bold",
	},
	BottomBottomText: {
		textAlign: "left",
		alignSelf: "flex-end",
		fontSize: 14,
		paddingHorizontal: 10,
		textAlignVertical: "center",
	},
	PresetInfoContainer: {
		flex: 1,
	},
});

export default PomodoroPresetContainer;

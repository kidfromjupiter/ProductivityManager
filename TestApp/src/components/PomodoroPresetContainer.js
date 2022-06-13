import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import InfoCircle from "./Circle";

const PomodoroPresetContainer = ({
	colors,
	totalTime,
	sessionTime,
	breakTime,
	title,
	numOfSessions,
	touchEndCallback,
	holdCallback,
	holdDelay,
}) => {
	return (
		<Pressable
			style={styles.PresetInfoContainer}
			onPress={touchEndCallback}
			onLongPress={() => {
				holdCallback();
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
			}}
			delayLongPress={holdDelay}
		>
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
					textColorLight={colors.textColorDark}
					text="min"
					adjustMargin={-10}
					backgroundColor={colors.levelThree}
				/>
				<Text style={[styles.titleText, { color: colors.textColorDark }]}>
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
					textColorLight={colors.textColorDark}
					text="min"
					textSize={12}
					adjustMargin={-5}
				/>
				<Text style={[styles.titleText, { color: colors.textColorDark }]}>
					Break
				</Text>
			</View>
			<View
				style={[
					styles.Presets,
					styles.PresetBottom,
					// { backgroundColor: colors.levelThree },
				]}
			>
				<Text
					style={[
						styles.titleText,
						styles.BottomText,
						{
							color: "black",
							backgroundColor: colors.levelFour,
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
							{ color: colors.textColorDark },
						]}
					>
						{numOfSessions} sessions
					</Text>
					<Text
						style={[
							styles.titleText,
							styles.BottomText,
							styles.BottomBottomText,
							{ color: colors.textColorDark },
						]}
					>
						Total : {totalTime}min
					</Text>
				</View>
			</View>
		</Pressable>
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

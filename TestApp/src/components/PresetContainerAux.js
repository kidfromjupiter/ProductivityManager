import React, { useEffect, useState } from "react";
import {
	Text,
	View,
	StyleSheet,
	Dimensions,
	TextInput,
	TouchableHighlight,
	TouchableOpacity,
} from "react-native";
import Square from "./square";
import PomodoroPresetContainer from "./PomodoroPresetContainer";
import { useDispatch, useSelector } from "react-redux";
import Slider from "@react-native-community/slider";
import {
	setNumOfSessions,
	setBreakTime,
	setSessionTime,
	deletePreset,
	setTitle,
} from "../redux/PomodoroSlice";
import { Ionicons, AntDesign } from "@expo/vector-icons";

const PresetContainerDetails = ({ details, showDetailsSetter }) => {
	const index = details.index;
	const colors = useSelector((state) => state.colors);
	const pomodoro = useSelector((state) => state.pomodoro.sessionData[index]);
	const [title, setTitle_local] = useState(pomodoro.title);

	const dispatch = useDispatch();
	const _setSessionDuration = (value, index) => {
		dispatch(setSessionTime({ time: value, index: index }));
	};
	const _setBreakDuration = (value, index) => {
		dispatch(setBreakTime({ time: value, index: index }));
	};
	const _setNumOfSessions = (value, index) => {
		dispatch(setNumOfSessions({ number: value, index: index }));
	};
	const _deletePreset = (index) => {
		dispatch(deletePreset({ index: index }));
	};
	const _setTitle = (value, index) => {
		dispatch(setTitle({ title: value, index: index }));
	};
	return (
		<View style={[styles.container, { backgroundColor: colors.levelFour }]}>
			<View style={[styles.rows, styles.headerContainer]}>
				<TextInput
					value={title}
					style={[
						styles.text,
						styles.headerText,
						{ borderBottomColor: colors.levelThree },
					]}
					onChangeText={(value) => setTitle_local(value)}
					autoFocus={details.id == undefined ? true : false}
				/>
				<Ionicons
					name="ios-trash-outline"
					size={28}
					color="white"
					style={[styles.iconStyle]}
					onPress={() => {
						_deletePreset(index);
						showDetailsSetter();
					}}
				/>
			</View>
			<View style={styles.rows}>
				<View style={styles.textHolder}>
					<Text style={styles.text}>Session duration</Text>
					<Text style={styles.text}>{pomodoro.sessionTime} min</Text>
				</View>
				<SliderHolder
					value={100}
					colors={colors}
					parentCallback={(value) => _setSessionDuration(value, index)}
					value={pomodoro.sessionTime}
					min={10}
					max={45}
				/>
			</View>
			<View style={styles.rows}>
				<View style={styles.textHolder}>
					<Text style={styles.text}>Number of sessions</Text>
					<Text style={styles.text}>{pomodoro.numOfSessions}</Text>
				</View>
				<SliderHolder
					value={100}
					colors={colors}
					parentCallback={(value) => _setNumOfSessions(value, index)}
					value={pomodoro.numOfSessions}
					min={2}
					max={10}
				/>
			</View>
			<View style={styles.rows}>
				<View style={styles.textHolder}>
					<Text style={styles.text}>Break duration</Text>
					<Text style={styles.text}>{pomodoro.breakTime} min</Text>
				</View>
				<SliderHolder
					value={100}
					colors={colors}
					parentCallback={(value) => _setBreakDuration(value, index)}
					value={pomodoro.breakTime}
					min={5}
					max={20}
				/>
			</View>
			<View style={{ flex: 1, flexDirection: "row" }}>
				<TouchableOpacity
					onPress={() => {
						showDetailsSetter();
					}}
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						padding: 10,
					}}
				>
					<AntDesign name="close" size={24} color="#E71F1F" />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						_setTitle(title, index);
						showDetailsSetter();
					}}
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						padding: 10,
					}}
				>
					<AntDesign name="check" size={24} color="white" />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const SliderHolder = ({
	title,
	value,
	onValueChange,
	colors,
	itemObject,
	min,
	max,
	parentCallback,
}) => {
	return (
		<View style={styles.SliderHolder}>
			<Slider
				style={{ height: 40 }}
				minimumValue={min}
				maximumValue={max}
				value={value}
				minimumTrackTintColor={colors.levelOne}
				maximumTrackTintColor={colors.levelTwo}
				thumbTintColor={colors.accentColor}
				onValueChange={(Slidervalue) => {
					parentCallback(Math.round(Slidervalue));
					// value = 0;
				}}
				// step={min - max}
			/>
		</View>
	);
};

const PresetContainerCondensed = ({
	itemObject,
	colors,
	ParentTouchEndCallback,
	index,
}) => {
	// console.log(index);
	return (
		<>
			<Square
				text={itemObject.title}
				flex={1}
				customStyles={[styles.listItem, { backgroundColor: colors.levelTwo }]}
				scaleDown={0.96}
				ParentTouchEndCallback={() => ParentTouchEndCallback(itemObject, index)}
				enableLongPress
			>
				<PomodoroPresetContainer
					colors={colors}
					sessionTime={itemObject.sessionTime}
					breakTime={itemObject.breakTime}
					totalTime={itemObject.totalTime}
					title={itemObject.title}
					numOfSessions={itemObject.numOfSessions}
				/>
			</Square>
		</>
	);
};

const styles = StyleSheet.create({
	list: {
		flex: 1,
		flexDirection: "row",
		width: Dimensions.get("window").width,
	},
	listItem: {
		borderBottomWidth: 0,
		borderRadius: 10,
		width: 200,
		flex: 1,
		justifyContent: "center",
		overflow: "hidden",
	},
	container: {
		flex: 1,
		position: "absolute",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		bottom: 20,
		left: 5,
		right: 5,
		borderRadius: 15,
		elevation: 10,
		overflow: "hidden",
	},
	rows: {
		flex: 1,
		justifyContent: "center",
		width: Dimensions.get("window").width - 20,
		paddingHorizontal: 10,
		// alignContent: "center",
	},
	text: {
		fontSize: 16,
		fontWeight: "bold",
	},
	headerContainer: {
		// backgroundColor: "grey",
		padding: 8,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	textHolder: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	headerText: {
		// textDecorationStyle: "dotted",
		// textDecorationColor: "black",
		// textDecorationLine: "underline",
		borderBottomColor: "grey",
		borderBottomWidth: 2,
		padding: 10,
		fontSize: 25,
	},
	iconStyle: {
		borderRadius: 7,
		backgroundColor: "#E71F1F",
		// padding: 1,
	},
});

export { PresetContainerDetails, PresetContainerCondensed };

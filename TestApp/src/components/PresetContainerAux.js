import { AntDesign, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import {
	Dimensions,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useSelector } from "react-redux";
import { PomodoroClass } from "../extras/classes/PomodoroCreator";
import sessionArrayGen from "../extras/sessionArrayGen";
import PomodoroPresetContainer from "./PomodoroPresetContainer";
import Square from "./square";

const PresetContainerDetails = ({
	details,
	showDetailsSetter,
	pomodoroList,
	setPomodoroPresetsList,
}) => {
	const colors = useSelector((state) => state.colors);
	const [detailsObjectSD, setDetailsObjectSD] = useState(details.sessionTime);
	const [detailsObjectBD, setDetailsObjectBD] = useState(details.breakTime);
	const [detailsObjectNOS, setDetailsObjectNOS] = useState(
		details.numOfSessions
	);
	const [detailsObjectT, setDetailsObjectT] = useState(details.title);

	const SaveToStorage = () => {
		const pomodoroNew = new PomodoroClass(
			detailsObjectT,
			detailsObjectNOS,
			detailsObjectSD,
			detailsObjectBD,
			details.id
		);
		let objList = [];
		pomodoroList.forEach((element) => {
			if (element.id == details.id) {
				objList.push(pomodoroNew);
			} else {
				objList.push(element);
			}
		});
		setPomodoroPresetsList(objList);

		console.log("Done.");
	};
	const _deletePreset = () => {
		let objList = [];
		pomodoroList.forEach((element) => {
			if (element.id != details.id) {
				objList.push(element);
			}
		});
		setPomodoroPresetsList(objList);
	};
	return (
		<View style={[styles.container, { backgroundColor: colors.levelFour }]}>
			<View style={[styles.rows, styles.headerContainer]}>
				<TextInput
					value={detailsObjectT}
					style={[
						styles.text,
						styles.headerText,
						{ borderBottomColor: colors.levelThree },
					]}
					onChangeText={(value) => setDetailsObjectT(value)}
				/>
				<Ionicons
					name="ios-trash-outline"
					size={28}
					color="white"
					style={[styles.iconStyle]}
					onPress={() => {
						_deletePreset();
						showDetailsSetter();
					}}
				/>
			</View>
			<View style={styles.rows}>
				<SliderObject
					min={5}
					max={45}
					value={detailsObjectSD}
					parentCallback={setDetailsObjectSD}
					text="Session Duration"
					suffix="min"
				/>
			</View>
			<View style={styles.rows}>
				<SliderObject
					min={2}
					max={10}
					value={detailsObjectNOS}
					parentCallback={setDetailsObjectNOS}
					text="Number of Sessions"
				/>
			</View>
			<View style={styles.rows}>
				<SliderObject
					min={5}
					max={20}
					value={detailsObjectBD}
					parentCallback={setDetailsObjectBD}
					text="Break Duration"
					suffix="min"
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
						SaveToStorage();
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

const SliderObject = ({ max, min, parentCallback, value, text, suffix }) => {
	const colors = useSelector((state) => state.colors);
	const [isSliding, setIsSliding] = useState(false);
	return (
		<>
			<View style={styles.textHolder}>
				<Text style={styles.text}>{text}</Text>
				<Text
					style={[
						styles.text,
						{
							backgroundColor: isSliding ? "white" : "transparent",
							paddingHorizontal: 5,
							borderRadius: 5,
							transform: [{ scale: isSliding ? 1.25 : 1 }],
							elevation: isSliding ? 5 : 0,
						},
					]}
				>
					{value} {suffix ? suffix : ""}
				</Text>
			</View>
			<SliderHolder
				colors={colors}
				parentCallback={(value) => parentCallback(value)}
				setSliding={setIsSliding}
				value={value}
				min={min}
				max={max}
			/>
		</>
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
	setSliding,
}) => {
	return (
		<View style={styles.SliderHolder}>
			<Slider
				style={{ height: 40 }}
				minimumValue={1}
				maximumValue={max}
				value={value}
				minimumTrackTintColor={colors.levelOne}
				maximumTrackTintColor={colors.levelTwo}
				thumbTintColor={colors.accentColor}
				onValueChange={(Slidervalue) => {
					setSliding(true);
					parentCallback(Math.round(Slidervalue));
				}}
				onSlidingComplete={(Slidervalue) => {
					parentCallback(Math.round(Slidervalue));
					setSliding(false);
				}}
			/>
		</View>
	);
};

const PresetContainerCondensed = ({
	itemObject,
	colors,
	ParentHoldCallback,
	index,
	touchEndCallback,
}) => {
	// console.log(index);
	return (
		<>
			<Square
				text={itemObject.title}
				flex={1}
				customStyles={[styles.listItem, { backgroundColor: colors.levelTwo }]}
				scaleDown={0.96}
				ParentHoldCallback={() => ParentHoldCallback(itemObject, index)}
				enableLongPress
			>
				<PomodoroPresetContainer
					colors={colors}
					sessionTime={itemObject.sessionTime}
					breakTime={itemObject.breakTime}
					totalTime={itemObject.totalTime}
					title={itemObject.title}
					numOfSessions={itemObject.numOfSessions}
					holdCallback={() => ParentHoldCallback(itemObject, index)}
					holdDelay={220}
					touchEndCallback={() => {
						touchEndCallback(
							sessionArrayGen(
								itemObject.sessionTime,
								itemObject.breakTime,
								itemObject.numOfSessions
							)
						);
					}}
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
		overflow: "hidden",
	},
	rows: {
		flex: 1,
		justifyContent: "center",
		width: Dimensions.get("window").width - 20,
		paddingHorizontal: 10,
	},
	text: {
		fontSize: 16,
		fontWeight: "bold",
	},
	headerContainer: {
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
		borderBottomColor: "grey",
		borderBottomWidth: 2,
		padding: 10,
		fontSize: 25,
	},
	iconStyle: {
		borderRadius: 7,
		backgroundColor: "#E71F1F",
		padding: 3,
		textAlign: "center",
		textAlignVertical: "center",
	},
});

export { PresetContainerDetails, PresetContainerCondensed };

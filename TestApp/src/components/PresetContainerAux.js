import React, { useEffect, useState } from "react";
import {
	Text,
	View,
	StyleSheet,
	Dimensions,
	TextInput,
	TouchableOpacity,
} from "react-native";
import Square from "./square";
import PomodoroPresetContainer from "./PomodoroPresetContainer";
import { useDispatch, useSelector } from "react-redux";
import Slider from "@react-native-community/slider";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import sessionArrayGen from "../extras/sessionArrayGen";
import { PomodoroClass } from "../extras/classes/PomodoroCreator";

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
						// LayoutAnimation.configureNext(
						// 	LayoutAnimation.Presets.easeInEaseOut
						// );
						_deletePreset();
						showDetailsSetter();
					}}
				/>
			</View>
			<View style={styles.rows}>
				<View style={styles.textHolder}>
					<Text style={styles.text}>Session duration</Text>
					<Text style={styles.text}>{detailsObjectSD} min</Text>
				</View>
				<SliderHolder
					colors={colors}
					parentCallback={(value) => setDetailsObjectSD(value)}
					value={detailsObjectSD}
					min={5}
					max={45}
				/>
			</View>
			<View style={styles.rows}>
				<View style={styles.textHolder}>
					<Text style={styles.text}>Number of sessions</Text>
					<Text style={styles.text}>{detailsObjectNOS}</Text>
				</View>
				<SliderHolder
					colors={colors}
					parentCallback={(value) => setDetailsObjectNOS(value)}
					value={detailsObjectNOS}
					min={2}
					max={10}
				/>
			</View>
			<View style={styles.rows}>
				<View style={styles.textHolder}>
					<Text style={styles.text}>Break duration</Text>
					<Text style={styles.text}>{detailsObjectBD} min</Text>
				</View>
				<SliderHolder
					colors={colors}
					parentCallback={(value) => setDetailsObjectBD(value)}
					value={detailsObjectBD}
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
				minimumValue={1}
				maximumValue={max}
				value={value}
				minimumTrackTintColor={colors.levelOne}
				maximumTrackTintColor={colors.levelTwo}
				thumbTintColor={colors.accentColor}
				onValueChange={(Slidervalue) => {
					parentCallback(Math.round(Slidervalue));
				}}
				onSlidingComplete={(Slidervalue) => {
					parentCallback(Math.round(Slidervalue));
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
		// zIndex: 100,
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

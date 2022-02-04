import React, { useEffect, useState } from "react";
import {
	Text,
	View,
	StyleSheet,
	Dimensions,
	TextInput,
	TouchableOpacity,
	LayoutAnimation,
} from "react-native";
import Square from "./square";
import PomodoroPresetContainer from "./PomodoroPresetContainer";
import { useDispatch, useSelector } from "react-redux";
import Slider from "@react-native-community/slider";

import { Ionicons, AntDesign } from "@expo/vector-icons";
import sessionArrayGen from "../extras/sessionArrayGen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PomodoroClass } from "../extras/PomodoroCreator";
import { incrementNumOfPresets } from "../redux/PomodoroSlice";

const PresetContainerDetails = ({ details, showDetailsSetter }) => {
	const colors = useSelector((state) => state.colors);
	const [detailsObjectSD, setDetailsObjectSD] = useState(details.sessionTime);
	const [detailsObjectBD, setDetailsObjectBD] = useState(details.breakTime);
	const [detailsObjectNOS, setDetailsObjectNOS] = useState(
		details.numOfSessions
	);
	const [detailsObjectT, setDetailsObjectT] = useState(details.title);

	const dispatch = useDispatch();
	const SaveToStorage = async () => {
		const pomodoroNew = new PomodoroClass(
			detailsObjectT,
			detailsObjectNOS,
			detailsObjectSD,
			detailsObjectBD,
			details.id
		);
		await AsyncStorage.mergeItem(details.id, pomodoroNew.stringify(), (value) =>
			value
				? console.log("there was an error", value)
				: dispatch(incrementNumOfPresets({ number: 1 }))
		);

		console.log("Done.");
	};

	const _setSessionDuration = (value) => {
		setDetailsObjectSD(value);
	};
	const _setBreakDuration = (value) => {
		setDetailsObjectBD(value);
	};
	const _setNumOfSessions = (value) => {
		setDetailsObjectNOS(value);
	};
	const _deletePreset = () => {
		// setDetailsObject((detailsObject.sessionTime = value));
		let removeValue = async (key) => {
			await AsyncStorage.removeItem(key, () =>
				dispatch(incrementNumOfPresets({ number: -1 }))
			);
		};

		removeValue(details.id)
			.then((value) => console.log(value))
			.catch((value) => console.log(value));
		// console.log("deleted");
	};
	const _setTitle = (value) => {
		setDetailsObjectT(value);
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
					onChangeText={(value) => _setTitle(value)}
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
				<View style={styles.textHolder}>
					<Text style={styles.text}>Session duration</Text>
					<Text style={styles.text}>{detailsObjectSD} min</Text>
				</View>
				<SliderHolder
					value={100}
					colors={colors}
					parentCallback={(value) => _setSessionDuration(value)}
					value={detailsObjectSD}
					min={10}
					max={45}
				/>
			</View>
			<View style={styles.rows}>
				<View style={styles.textHolder}>
					<Text style={styles.text}>Number of sessions</Text>
					<Text style={styles.text}>{detailsObjectNOS}</Text>
				</View>
				<SliderHolder
					value={100}
					colors={colors}
					parentCallback={(value) => _setNumOfSessions(value)}
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
					value={100}
					colors={colors}
					parentCallback={(value) => _setBreakDuration(value)}
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
						SaveToStorage().finally((value) => console.log(value));
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
	const [_slidervalue, _setSliderValue] = useState(value);
	const [_sliding, _setSliding] = useState(false);
	return (
		<View style={styles.SliderHolder}>
			{_sliding ? (
				<View
					style={{
						flex: 1,
						position: "absolute",
						left: Dimensions.get("window").width / 2,
						backgroundColor: "white",
						elevation: 5,
						padding: 12,
						bottom: 45,
						borderRadius: 15,
					}}
				>
					<Text style={{ fontWeight: "bold" }}>{_slidervalue}</Text>
				</View>
			) : null}

			<Slider
				style={{ height: 40 }}
				minimumValue={1} //change back to min
				maximumValue={max}
				value={_slidervalue}
				minimumTrackTintColor={colors.levelOne}
				maximumTrackTintColor={colors.levelTwo}
				thumbTintColor={colors.accentColor}
				onSlidingStart={() => {
					LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
					_setSliding(true);
				}}
				onValueChange={(Slidervalue) => {
					_setSliderValue(Math.round(Slidervalue));
					// value = 0;
				}}
				onSlidingComplete={() => {
					LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
					_setSliding(false);
					parentCallback(_slidervalue);
				}}
				// step={min - max}
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
					holdDelay={150}
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

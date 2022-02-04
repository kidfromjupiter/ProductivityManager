import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	FlatList,
	LayoutAnimation,
	Text,
	Alert,
	Vibration,
	Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import dateParser from "../extras/dateparser";
import storeData from "../extras/saveData";
import Timer from "../components/Counter";
import ListHeader from "../components/ListHeader";
import {
	resetTimer,
	setTime,
	toggleTimer,
	incrementNumOfPresets,
	setNewCycle,
	setCycleData,
	exitCleanup,
} from "../redux/PomodoroSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PomodoroClass } from "../extras/PomodoroCreator";
import AnimatedRing from "../components/AnimatedRing";
import {
	PresetContainerCondensed,
	PresetContainerDetails,
} from "../components/PresetContainerAux";
import InfoBar from "../components/InfoBar";

const Pomodoro = ({ navigation }) => {
	const colors = useSelector((state) => state.colors);
	const [showDetails, setShowDetails] = useState(null);
	const pomodoro = useSelector((state) => state.pomodoro);
	const [pomodoroPresetsList, setPomodoroPresetsList] = useState([]);
	const [FlatlistSize, setFlatlistSize] = useState(0);
	const animation = LayoutAnimation.create(
		175,
		LayoutAnimation.Types.easeInEaseOut,
		LayoutAnimation.Properties.scaleXY
	);
	LayoutAnimation.configureNext(animation);

	const dispatch = useDispatch();
	const _SETTIME = (value) => {
		Vibration.vibrate(50);
		dispatch(setTime({ time: value.time }));
	};
	const _RESETTIME = () => {
		dispatch(resetTimer());
	};
	const _TOGGLETIMER = () => {
		dispatch(toggleTimer());
	};
	const _INCREMENETPRESETNUMBER = (value) => {
		dispatch(incrementNumOfPresets({ number: value }));
	};
	const _SETCYCLEDATA = (value) => {
		dispatch(setCycleData({ array: value }));
	};
	const _SETNEWCYCLE = () => {
		dispatch(setNewCycle());
	};
	const _CLEANUP = () => {
		dispatch(exitCleanup());
	};
	useEffect(
		() =>
			navigation.addListener("beforeRemove", (e) => {
				e.preventDefault();
				Alert.alert(
					"Leave?",
					"This will reset the pomodoro. Do you still want to leave?",
					[
						{ text: "No", style: "cancel", onPress: () => {} },
						{
							text: "Yes",
							style: "destructive",
							onPress: () => {
								navigation.dispatch(e.data.action);
							},
						},
					]
				);
			}),
		[]
	);

	useEffect(() => {
		return () => {
			console.log("running cleanup");
			_CLEANUP();
		};
	}, []);

	const renderItem = ({ item, index }) => {
		const itemObject = JSON.parse(item);
		return (
			<PresetContainerCondensed
				itemObject={itemObject}
				colors={colors}
				ParentHoldCallback={toggleDetails}
				index={index}
				touchEndCallback={(value) => _SETCYCLEDATA(value)}
			/>
		);
	};
	const clearAll = async () => {
		try {
			await AsyncStorage.clear();
		} catch (e) {
			// clear error
		}

		console.log("Done.");
	};
	useEffect(() => {
		if (pomodoro.isRunning && !pomodoro.isFinished) {
			_SETNEWCYCLE();
		}
	}, [pomodoro.isSession]);

	useEffect(() => {
		const getallObjects = async () => {
			let keys = [];
			let values = [];
			try {
				keys = await AsyncStorage.getAllKeys();
			} catch (e) {
				console.log(e);
			}
			try {
				let [...values] = await AsyncStorage.multiGet(keys);
				let newValues = [];
				values.forEach((item) => {
					newValues.unshift(item[1]);
				});
				setPomodoroPresetsList(newValues);
			} catch (e) {
				console.log(e);
			}
		};
		getallObjects();
	}, [pomodoro.numOfPresets]);

	// nuke everything
	// clearAll();

	// console.log(pomodoro);

	const createPomodoro = () => {
		let numOfSessions = 3;
		let breakTime = 10;
		let sessionTime = 25;
		let title = "Pomodoro";
		let pomodoro = new PomodoroClass(
			title,
			numOfSessions,
			sessionTime,
			breakTime
		);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		storeData(pomodoro.id, pomodoro.stringify());
		console.log("created and saved");
		_INCREMENETPRESETNUMBER(1);
		// toggleDetails({}, 0);
	};

	const toggleDetails = (details) => {
		if (details) {
			setShowDetails(details);
		} else {
			setShowDetails(null);
		}
	};

	const { minutes, seconds } = dateParser(pomodoro.time);

	// console.log(pomodoro.cycleData.length);

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: colors.backgroundColor,
				},
			]}
		>
			<AnimatedRing
				flex={8}
				animated={pomodoro.isRunning ? true : false}
				ringColor={
					!pomodoro.isFinished
						? pomodoro.isRunning
							? colors.accentColor
							: "red"
						: "orange"
				}
			>
				<Timer
					timeSize={70}
					context="pomodoro"
					setTimer={_SETTIME}
					StartTimer={_TOGGLETIMER}
					timer={pomodoro}
					ResetTimer={_RESETTIME}
					minutes={minutes}
					seconds={seconds}
				/>
			</AnimatedRing>
			{!showDetails ? (
				<View style={[styles.infobarHolder, { bottom: FlatlistSize + 10 }]}>
					{!pomodoro.isSession ? (
						<InfoBar
							customstyles={[
								styles.infobar,
								// { bottom: FlatlistSize + 10, zIndex: 2 },
							]}
							info="Break"
						></InfoBar>
					) : null}
					{pomodoro.cycleData.length > 0 ? (
						<InfoBar
							customstyles={[
								styles.infobar,
								// { bottom: FlatlistSize + 50, zIndex: 2 },
							]}
							info={
								Math.round(pomodoro.cycleData.length / 2) + " sessions left"
							}
						></InfoBar>
					) : null}
				</View>
			) : null}

			<View
				style={styles.listContainer}
				onLayout={(e) => {
					const { height } = e.nativeEvent.layout;
					setFlatlistSize(height);
				}}
			>
				<ListHeader
					extraStyle={{
						padding: 10,
						backgroundColor: colors.levelOne,
						borderTopRightRadius: 15,
						borderTopLeftRadius: 15,
					}}
					onPressCallback={createPomodoro}
					text="Presets"
				/>
				<FlatList
					extraData={pomodoroPresetsList}
					data={pomodoroPresetsList}
					style={[styles.list, { backgroundColor: colors.levelOne }]}
					renderItem={(item) => renderItem(item)}
					keyExtractor={(item) => {
						const itemObject = JSON.parse(item);
						return itemObject.id;
					}}
					horizontal
					showsHorizontalScrollIndicator={false}
				/>
			</View>
			{showDetails ? (
				<PresetContainerDetails
					details={showDetails}
					showDetailsSetter={toggleDetails}
				/>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingTop: 30,
	},

	listContainer: {
		flex: 5,
	},
	infobar: {
		// width: 50,
		// flex: 1,
		borderRadius: 10,
	},
	infobarHolder: {
		flex: 1,
		flexDirection: "row",
		bottom: 0,
		right: 10,
		position: "absolute",
	},
});

export default Pomodoro;

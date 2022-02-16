import React, { useState, useEffect } from "react";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import {
	View,
	StyleSheet,
	FlatList,
	LayoutAnimation,
	Alert,
	Text,
	Button,
	Pressable,
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
import * as Haptics from "expo-haptics";
import BackButton from "../components/backButtonComponent";
import { MaterialIcons } from "@expo/vector-icons";

const Pomodoro = ({ navigation }) => {
	const colors = useSelector((state) => state.colors);
	const [showDetails, setShowDetails] = useState(null);
	const pomodoro = useSelector((state) => state.pomodoro);
	const [pomodoroPresetsList, setPomodoroPresetsList] = useState([]);
	const [isAod, setisAod] = useState(false);

	const animation = LayoutAnimation.create(
		// 175,
		190,
		LayoutAnimation.Types.easeInEaseOut,
		LayoutAnimation.Properties.scaleXY
	);

	const dispatch = useDispatch();
	const _SETTIME = (value) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
			navigation
				? navigation.addListener("beforeRemove", (e) => {
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
				  })
				: null,
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
				touchEndCallback={(value) => {
					LayoutAnimation.configureNext(animation);
					_SETCYCLEDATA(value);
				}}
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
					item[0] == "reminders" || item[0] == "persist:root"
						? null
						: newValues.unshift(item[1]);
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
		storeData(pomodoro.id, pomodoro.stringify());
		console.log("created and saved");
		_INCREMENETPRESETNUMBER(1);
	};

	const toggleDetails = (details) => {
		if (details) {
			LayoutAnimation.configureNext(animation);
			setShowDetails(details);
		} else {
			LayoutAnimation.configureNext(animation);
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
					backgroundColor: !isAod ? colors.backgroundColor : "#000000",
				},
			]}
		>
			<BackButton navigation={navigation} color={colors} />
			<View
				style={[
					styles.infobarHolder,
					{ position: "absolute", right: 10, top: 40 },
				]}
			>
				{pomodoro.isRunning ? (
					<Pressable
						onPress={() => {
							isAod ? deactivateKeepAwake() : activateKeepAwake();

							setisAod(!isAod);
						}}
						style={[
							styles.buttonStyles,
							{ zIndex: 1000 },
							{ backgroundColor: isAod ? "black" : "white" },
						]}
					>
						<MaterialIcons
							name="settings-display"
							size={30}
							color={!isAod ? "black" : "white"}
						/>
					</Pressable>
				) : null}
			</View>
			{!isAod ? (
				<AnimatedRing
					flex={9}
					animated={pomodoro.isRunning ? true : false}
					ringColor={
						!pomodoro.isFinished
							? pomodoro.isRunning
								? colors.accentColor
								: colors.backgroundColor
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
						layoutanimation={animation}
					/>
				</AnimatedRing>
			) : (
				<Timer
					timeSize={90}
					context="pomodoro"
					setTimer={_SETTIME}
					StartTimer={_TOGGLETIMER}
					timer={pomodoro}
					ResetTimer={_RESETTIME}
					isDisabled={pomodoro.isRunning ? true : false}
					minutes={minutes}
					seconds={seconds}
				/>
			)}

			{!showDetails ? (
				<View style={[styles.infobarHolder]}>
					{!pomodoro.isSession ? (
						<InfoBar customstyles={[styles.infobar]} info="Break"></InfoBar>
					) : null}
					{pomodoro.cycleData.length > 0 ? (
						<InfoBar
							customstyles={[styles.infobar]}
							info={
								Math.round(pomodoro.cycleData.length / 2) + " sessions left"
							}
						></InfoBar>
					) : null}
				</View>
			) : null}

			{!isAod ? (
				<View style={styles.listContainer}>
					<ListHeader
						extraStyle={{
							padding: 10,
							backgroundColor: colors.levelOne,
							borderTopRightRadius: 15,
							borderTopLeftRadius: 15,
						}}
						onPressCallback={createPomodoro}
						text="Presets"
						animation={animation}
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
			) : null}
			{showDetails ? (
				<PresetContainerDetails
					details={showDetails}
					showDetailsSetter={toggleDetails}
					animation={animation}
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
		borderRadius: 10,
	},
	infobarHolder: {
		zIndex: 100,
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	buttonStyles: {
		backgroundColor: "white",
		// paddingHorizontal: 10,
		margin: 5,
		padding: 10,
		// paddingVertical: 8,
		borderRadius: 25,
		justifyContent: "center",
	},
});

export default Pomodoro;

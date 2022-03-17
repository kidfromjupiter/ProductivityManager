import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import React, { useEffect, useState } from "react";
import {
	Alert, FlatList,
	LayoutAnimation, Pressable, StyleSheet, View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AnimatedRing from "../components/AnimatedRing";
import BackButton from "../components/backButtonComponent";
import Timer from "../components/Counter";
import InfoBar from "../components/InfoBar";
import ListHeader from "../components/ListHeader";
import {
	PresetContainerCondensed,
	PresetContainerDetails
} from "../components/PresetContainerAux";
import { PomodoroClass } from "../extras/classes/PomodoroCreator";
import dateParser from "../extras/dateparser";
import {
	exitCleanup, incrementNumOfPresets, resetTimer, setCycleData, setNewCycle, setTime,
	toggleTimer
} from "../redux/PomodoroSlice";
// import { Tracker } from "../extras/TrackerObject";

const Pomodoro = ({ navigation }) => {
	const colors = useSelector((state) => state.colors);
	const [showDetails, setShowDetails] = useState(null);
	const pomodoro = useSelector((state) => state.pomodoro);
	const [pomodoroPresetsList, setPomodoroPresetsList] = useState([]);
	const [isAod, setisAod] = useState(false);
	// LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

	const animation = LayoutAnimation.create(
		// 175,
		185,
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
		console.log(JSON.stringify(pomodoroPresetsList));
		try {
			AsyncStorage.setItem("pomodoro", JSON.stringify(pomodoroPresetsList));
			dispatch(exitCleanup());
		} catch (error) {}
	};
	useEffect(
		() =>
			navigation
				? navigation.addListener("beforeRemove", (e) => {
						e.preventDefault();
						Alert.alert(
							"Leave?",
							"Leaving will result in loss of productivity and procrastination. Disappointment may follow. Do you wish to proceed?",
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
	}, [pomodoroPresetsList]);
	useEffect(() => {
		if (pomodoro.isRunning && !pomodoro.isFinished) {
			_SETNEWCYCLE();
		}
	}, [pomodoro.isSession]);

	useEffect(() => {
		const getallObjects = async () => {
			let newValues = [];
			try {
				AsyncStorage.getItem("pomodoro").then((value) => {
					try {
						console.log(value);
						JSON.parse(value).forEach((item) => {
							newValues.unshift(item);
						});
						setPomodoroPresetsList(newValues);
					} catch {
						console.log("error in getting pomodoro");
					}
				});
			} catch (e) {
				console.log(e);
			}
		};
		getallObjects();
	}, []);

	// console.log(pomodoroPresetsList);

	const renderItem = ({ item, index }) => {
		const itemObject = item;
		return (
			<PresetContainerCondensed
				itemObject={itemObject}
				colors={colors}
				ParentHoldCallback={toggleDetails}
				index={index}
				touchEndCallback={(value) => {
					LayoutAnimation.easeInEaseOut();
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
		const newArray = [pomodoro].concat(pomodoroPresetsList);
		setPomodoroPresetsList(newArray);
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
						iconName="pluscircle"
					/>
					<FlatList
						extraData={pomodoroPresetsList}
						data={pomodoroPresetsList}
						style={[styles.list, { backgroundColor: colors.levelOne }]}
						renderItem={(item) => renderItem(item)}
						keyExtractor={(item) => {
							return item.id;
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
					setPomodoroPresetsList={setPomodoroPresetsList}
					pomodoroList={pomodoroPresetsList}
				/>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
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
		margin: 5,
		padding: 10,
		borderRadius: 25,
		justifyContent: "center",
	},
});

export default Pomodoro;

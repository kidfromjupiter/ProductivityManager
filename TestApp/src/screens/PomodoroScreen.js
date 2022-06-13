import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import React, { useCallback, useEffect, useState } from "react";
import {
	Alert,
	FlatList,
	LayoutAnimation,
	Pressable,
	StyleSheet,
	View,
	Dimensions,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import AnimatedRing from "../components/AnimatedRing";
import BackButton from "../components/backButtonComponent";
import Timer from "../components/Counter";
import InfoBar from "../components/InfoBar";
import ListHeader from "../components/ListHeader";
import {
	PresetContainerCondensed,
	PresetContainerDetails,
} from "../components/PresetContainerAux";
import { PomodoroClass } from "../extras/classes/PomodoroCreator";
import dateParser from "../extras/dateparser";
import {
	exitCleanup,
	incrementNumOfPresets,
	resetTimer,
	setCycleData,
	setNewCycle,
	setTime,
	toggleTimer,
} from "../redux/PomodoroSlice";
import Animated, {
	useAnimatedProps,
	useSharedValue,
	withTiming,
	Layout,
	ZoomIn,
	ZoomOut,
	FadeIn,
	FadeOut,
	FadeInLeft,
	ZoomInRight,
	ZoomOutRight,
} from "react-native-reanimated";
import { GradientBackground } from "./Analytics/Today";

const CIRCLE_LENGTH = 880;
const R = CIRCLE_LENGTH / (2 * Math.PI);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const Pomodoro = ({ navigation }) => {
	const colors = useSelector((state) => state.colors);
	const [showDetails, setShowDetails] = useState(null);
	const pomodoro = useSelector((state) => state.pomodoro);
	const [pomodoroPresetsList, setPomodoroPresetsList] = useState([]);
	const [isAod, setisAod] = useState(false);
	const PROGRESS = useSharedValue(0);
	const [layout, setLayout] = useState({ width: 0, height: 0 });
	function onLayout(event) {
		const { width, height } = event.nativeEvent.layout;
		setLayout({ width, height });
	}

	const dispatch = useDispatch();
	const _SETTIME = useCallback((value) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		dispatch(setTime({ time: value.time }));
	}, []);
	const _RESETTIME = useCallback(() => {
		dispatch(resetTimer());
	}, []);
	const _TOGGLETIMER = useCallback(() => {
		dispatch(toggleTimer());
	}, []);
	const _INCREMENETPRESETNUMBER = useCallback((value) => {
		dispatch(incrementNumOfPresets({ number: value }));
	}, []);
	const _SETCYCLEDATA = useCallback((value, name, id) => {
		dispatch(setCycleData({ array: value, name: name, id: id }));
	}, []);
	const _SETNEWCYCLE = useCallback(() => {
		dispatch(setNewCycle());
	}, []);

	useEffect(
		useCallback(
			() =>
				navigation
					? navigation.addListener("beforeRemove", (e) => {
							e.preventDefault();
							Alert.alert(
								"Leave?",
								"Leaving will result in loss of productivity and procrastination. Disappointment may follow. Do you wish to proceed? Your session will be paused",
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
			[navigation]
		),
		[]
	);

	// cleanup
	useEffect(() => {}, [pomodoroPresetsList]);

	useEffect(() => {
		const getallObjects = async () => {
			const newValues = [];
			try {
				AsyncStorage.getItem("pomodoro").then((value) => {
					try {
						JSON.parse(value).forEach((item) => {
							newValues.unshift(item);
						});
						setPomodoroPresetsList(newValues);
					} catch (e) {
						console.log("error in getting pomodoro");
					}
				});
			} catch (e) {
				console.log(e);
			}
		};
		getallObjects();
	}, []);

	useEffect(() => {
		// if (pomodoro.cycleData) {
		PROGRESS.value = withTiming(
			pomodoro.cycleData.length / pomodoro.numOfTotalSessions
		);
		// }
	}, [pomodoro.cycleData, pomodoro.numOfTotalSessions]);

	const renderItem = ({ item, index }) => {
		const itemObject = item;
		return (
			<Animated.View
				entering={ZoomIn.delay(50 * index)}
				exiting={ZoomOut}
				layout={Layout.springify().duration(100)}
				key={item.id}
			>
				<PresetContainerCondensed
					itemObject={itemObject}
					colors={colors}
					ParentHoldCallback={toggleDetails}
					index={index}
					selectedIndex={pomodoro.pomodoroID}
					touchEndCallback={(value, name, id) => {
						LayoutAnimation.easeInEaseOut();
						if (pomodoro.cycleData.length == 0) {
							_SETCYCLEDATA(value, name, id);
						} else {
							Alert.alert(
								"Start Pomodoro?",
								"This will clear the current pomodoro and won't be marked as a complete session. Do you wish to proceed?",
								[
									{ text: "No", style: "cancel", onPress: () => {} },
									{
										text: "Yes",
										style: "destructive",
										onPress: () => {
											_SETCYCLEDATA(value, name, id);
										},
									},
								]
							);
						}
					}}
				/>
			</Animated.View>
		);
	};

	const createPomodoro = () => {
		const numOfSessions = 3;
		const breakTime = 10;
		const sessionTime = 25;
		const title = "Pomodoro";
		const pomodoro = new PomodoroClass(
			title,
			numOfSessions,
			sessionTime,
			breakTime
		);
		const newArray = [pomodoro].concat(pomodoroPresetsList);
		setPomodoroPresetsList(newArray);
		AsyncStorage.setItem("pomodoro", JSON.stringify(pomodoroPresetsList)).then(
			() => console.log("saved")
		);
		_INCREMENETPRESETNUMBER(1);
	};

	const toggleDetails = (details) => {
		if (details) {
			LayoutAnimation.easeInEaseOut();
			setShowDetails(details);
		} else {
			LayoutAnimation.easeInEaseOut();
			setShowDetails(null);
		}
	};
	const animatedProp = useAnimatedProps(() => ({
		strokeDashoffset: CIRCLE_LENGTH * PROGRESS.value,
	}));
	const { minutes, seconds } = dateParser(pomodoro.time);
	return (
		<Animated.View
			style={[
				styles.container,
				{
					backgroundColor: !isAod ? colors.backgroundColor : "#000000",
				},
			]}
			layout={Layout.duration(100)}
		>
			{!isAod ? (
				<View style={{ zIndex: 0 }}>
					<GradientBackground
						height={Dimensions.get("screen").height}
						width={Dimensions.get("screen").width}
						cx={Dimensions.get("screen").width / 2}
						cy={10}
						accent={
							!pomodoro.isFinished
								? pomodoro.isRunning
									? colors.accentColor
									: colors.backgroundColor
								: "orange"
						}
					/>
				</View>
			) : null}
			{layout.width != 0 && !isAod ? (
				<Animated.View
					style={{
						position: "absolute",
						right: 0,
						left: 0,
						top: 0,
						bottom: 0,
					}}
					entering={FadeIn}
					exiting={FadeOut}
				>
					<Svg>
						<AnimatedCircle
							cx={layout.width / 2}
							cy={layout.height / 2}
							r={R}
							stroke={colors.levelThree}
							strokeWidth={5}
							strokeDasharray={CIRCLE_LENGTH}
							animatedProps={animatedProp}
							strokeLinecap={"round"}
							transform={`rotate(-90 ${layout.width / 2} ${layout.height / 2})`}
						/>
					</Svg>
				</Animated.View>
			) : null}

			<BackButton navigation={navigation} color={colors} />
			<View
				style={[
					styles.infobarHolder,
					{ position: "absolute", right: 10, top: 40 },
				]}
			>
				{pomodoro.isRunning ? (
					<Animated.View
						style={[
							styles.buttonStyles,
							{ zIndex: 1000 },
							{ backgroundColor: isAod ? "black" : "white" },
						]}
						entering={ZoomInRight}
						exit={ZoomOutRight}
					>
						<Pressable
							onPress={() => {
								isAod ? deactivateKeepAwake() : activateKeepAwake();
								setisAod(!isAod);
								console.log("pressed");
							}}
						>
							<MaterialIcons
								name="settings-display"
								size={30}
								color={!isAod ? "black" : "white"}
							/>
						</Pressable>
					</Animated.View>
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
					onLayout={onLayout}
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
						timerEndCallback={_SETNEWCYCLE}
						backgroundColor={colors.backgroundColor}
						timerFinishedPopupText={"Pomodoro Finished!"}
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
					timerEndCallback={_SETNEWCYCLE}
					backgroundColor={colors.backgroundColor}
					timerFinishedPopupText={"Pomodoro Finished!"}
				/>
			)}
			{pomodoro.cycleData.length > 0 ? (
				<View
					style={{
						justifyContent: "flex-start",
						alignItems: "center",
						flex: 1,
					}}
				>
					<TouchableOpacity style={{ padding: 5 }} onPress={_SETNEWCYCLE}>
						{/* <AntDesign name="forward" size={24} color="white" /> */}
						{/* <Ionicons name="chevron-forward" size={27} color="white" /> */}
						<Feather name="fast-forward" size={24} color="white" />
					</TouchableOpacity>
				</View>
			) : null}

			{!showDetails ? (
				<View
					style={[
						styles.infobarHolder,
						{
							position: "absolute",
							top: 25,
							left: 0,
							padding: 10,
						},
					]}
				>
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
					{pomodoro.cycleData.length == 0 ? (
						<InfoBar
							customstyles={[styles.infobar]}
							info={"Last session"}
						></InfoBar>
					) : null}
				</View>
			) : null}

			{!isAod ? (
				<Animated.View
					style={styles.listContainer}
					layout={Layout.duration(250)}
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
						iconName="pluscircle"
					/>
					{/* <FlatList
						extraData={pomodoroPresetsList}
						data={pomodoroPresetsList}
						style={[styles.list, { backgroundColor: colors.levelOne }]}
						renderItem={(item) => renderItem(item)}
						keyExtractor={(item) => {
							return item.id;
						}}
						horizontal
						showsHorizontalScrollIndicator={false}
					/> */}
					<ScrollView
						style={[styles.listContainer, { backgroundColor: colors.levelOne }]}
						horizontal={true}
					>
						{pomodoroPresetsList.map((item, index) => {
							return renderItem({ item: item, index: index });
						})}
					</ScrollView>
				</Animated.View>
			) : null}
			{showDetails ? (
				<PresetContainerDetails
					details={showDetails}
					showDetailsSetter={toggleDetails}
					setPomodoroPresetsList={setPomodoroPresetsList}
					pomodoroList={pomodoroPresetsList}
				/>
			) : null}
		</Animated.View>
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

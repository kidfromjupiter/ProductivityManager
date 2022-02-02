import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, LayoutAnimation } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import dateParser from "../extras/dateparser";
import Timer from "../components/Counter";
import ListHeader from "../components/ListHeader";
import {
	setSessionData,
	setCurrentSessionArray,
	toggleTimer,
	setTimer,
	resetTimer,
	decrementCurrentSessionArrayAndStart,
} from "../redux/PomodoroSlice";
import { PomodoroClass } from "../extras/PomodoroCreator";
import AnimatedRing from "../components/AnimatedRing";
import {
	PresetContainerCondensed,
	PresetContainerDetails,
} from "../components/PresetContainerAux";

const Pomodoro = ({}) => {
	const pomodoro = useSelector((state) => state.pomodoro);
	const colors = useSelector((state) => state.colors);
	const [showDetails, setShowDetails] = useState(null);

	// console.log(sessionArrayGen(30, 10, 5));

	const dispatch = useDispatch();

	//toggles isRunning and isPaused if time != 0
	const StartTimer = () => {
		if (pomodoro.time !== 0) {
			dispatch(toggleTimer());
		}
	};
	const ResetTimer = () => {
		dispatch(resetTimer());
	};
	const SetTimer = (value) => {
		if (value.time == 0) {
			const setValue = Object.assign({ session: false }, value);
			dispatch(setTimer(setValue));
			// dispatch(toggleTimerFinished());
		} else {
			dispatch(setTimer(value));
		}
	};

	//sets the timer details in the redux and toggles isRunning and Ispaused
	const setTimerDetails = (details) => {
		ResetTimer();
		SetTimer({ time: details.time * 60 });
	};

	const _setCurrentSessionArray = (value) => {
		console.log("current session array funct ", value);
		dispatch(setCurrentSessionArray({ array: value }));
	};

	const { minutes, seconds } = dateParser(pomodoro.time);
	const renderItem = ({ item, index }) => {
		// console.log(,index);
		return (
			<PresetContainerCondensed
				itemObject={item}
				colors={colors}
				ParentHoldCallback={toggleDetails}
				index={index}
				// touchEndCallback={(value) => {
				// 	_setCurrentSessionArray(value);
				// 	setTimerDetails({ time: pomodoro.currentSessionArray[0] });
				// }}
				touchEndCallback={_setCurrentSessionArray}
			/>
		);
	};
	if (
		pomodoro.time == 0 &&
		pomodoro.isRunning &&
		pomodoro.currentSessionArray.length !== 0
	) {
		dispatch(decrementCurrentSessionArrayAndStart());
	}

	useEffect(() => {
		if (
			pomodoro.currentSessionArray.length >= 0 &&
			pomodoro.currentSessionArray[0]
		) {
			setTimerDetails({ time: pomodoro.currentSessionArray[0] });
		}
	}, [pomodoro.currentSessionArray]);

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
		dispatch(setSessionData(pomodoro.objectify()));
		toggleDetails({}, 0);
	};

	const toggleDetails = (details, index) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		if (details) {
			const indexDetails = { index: index };
			let detailsToShow = { ...details };
			const newDetails = Object.assign(detailsToShow, indexDetails);
			setShowDetails(newDetails);
		} else {
			setShowDetails(null);
		}
	};

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: colors.backgroundColor,
				},
			]}
		>
			<AnimatedRing flex={8} animated={pomodoro.isRunning ? true : false}>
				<Timer
					// isDisabled
					timeSize={70}
					context="pomodoro"
					ResetTimer={() => {
						ResetTimer();
					}}
					StartTimer={StartTimer}
					setTimer={SetTimer}
					timer={pomodoro}
					minutes={minutes}
					seconds={seconds}
				/>
			</AnimatedRing>
			{/* <View
				style={{ flex: 1, backgroundColor: "red" }}
				onTouchEnd={() =>
					pomodoro.currentSessionArray[0]
						? setTimerDetails({ time: pomodoro.currentSessionArray[0] })
						: null
				}
			></View> */}
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
				/>
				<FlatList
					data={pomodoro.sessionData}
					style={[styles.list, { backgroundColor: colors.levelOne }]}
					renderItem={(item) => renderItem(item)}
					keyExtractor={(item) => item.id}
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
});

export default Pomodoro;

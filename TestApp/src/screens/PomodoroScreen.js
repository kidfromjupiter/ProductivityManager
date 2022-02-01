import React, { useRef, useState } from "react";
import {
	View,
	StyleSheet,
	FlatList,
	Dimensions,
	LayoutAnimation,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Timer from "../components/Counter";
import ListHeader from "../components/ListHeader";
import { setSessionData, setTimerRunning } from "../redux/PomodoroSlice";
import { PomodoroClass } from "../extras/PomodoroCreator";
import Square from "../components/square";
import { AnimatedRing } from "../components/AnimatedRing";
import PomodoroPresetContainer from "../components/PomodoroPresetContainer";
import {
	PresetContainerCondensed,
	PresetContainerDetails,
} from "../components/PresetContainerAux";

const Pomodoro = ({}) => {
	const pomodoro = useSelector((state) => state.pomodoro);
	const colors = useSelector((state) => state.colors);
	const [showDetails, setShowDetails] = useState(null);

	const dispatch = useDispatch();

	// fadeOutScaleUp();
	const renderItem = ({ item, index }) => {
		// console.log(,index);
		return (
			<PresetContainerCondensed
				itemObject={item}
				colors={colors}
				ParentTouchEndCallback={toggleDetails}
				index={index}
			/>
		);
	};

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
			<AnimatedRing flex={8}>
				<Timer
					isDisabled
					timeSize={70}
					context="pomodoro"
					startTimer={setTimerRunning}
				/>
			</AnimatedRing>
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

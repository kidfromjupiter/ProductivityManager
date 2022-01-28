import React from "react";
import {
	View,
	StyleSheet,
	Text,
	Animated,
	FlatList,
	Dimensions,
	DevSettings,
	LayoutAnimation,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Timer from "../components/Counter";
import ListHeader from "../components/ListHeader";
import { setSessionData, setTimerRunning } from "../redux/PomodoroSlice";
import { PomodoroClass } from "../extras/PomodoroCreator";
import Square from "../components/square";
import Slider from "@react-native-community/slider";
import { AnimatedRing } from "../components/AnimatedRing";

const Pomodoro = ({}) => {
	const pomodoro = useSelector((state) => state.pomodoro);
	const colors = useSelector((state) => state.colors);
	const dispatch = useDispatch();

	// fadeOutScaleUp();
	const renderItem = ({ item }) => {
		let itemObject = JSON.parse(item);
		return (
			<Square
				text={itemObject.title}
				flex={1}
				customStyles={[styles.listItem, { backgroundColor: colors.levelTwo }]}
				scaleDown={0.95}
				holdToExpand
				expandSize={{ width: Dimensions.get("screen").width - 10 }}
			>
				<View style={styles.PresetInfoContainer}>
					<View style={styles.PresetTitle}>
						<Text style={styles.PresetTitleText}>{itemObject.title}</Text>
					</View>
					<View style={styles.PresetInfo}>
						<Text>{itemObject.totalTime}</Text>
					</View>
				</View>
			</Square>
		);
		// console.log(JSON.parse(item).title);
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
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		dispatch(setSessionData(pomodoro.stringify()));
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
					renderItem={renderItem}
					keyExtractor={(item) => JSON.parse(item).id}
					horizontal
					showsHorizontalScrollIndicator={false}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 30,
	},

	listContainer: {
		flex: 5,
	},
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
	PresetInfoContainer: {
		flex: 1,
		// padding: 10,
	},
	PresetTitle: {
		flex: 1,
		borderBottomColor: "white",
		borderBottomWidth: 1,
		justifyContent: "center",
	},
	PresetInfo: {
		flex: 5,
	},
	PresetTitleText: {
		color: "white",
		fontSize: 17,
		fontWeight: "bold",
		padding: 10,
	},
});

export default Pomodoro;

import { StatusBar } from "expo-status-bar";
import React from "react";
import {
	Dimensions,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
	VirtualizedList,
	FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeColorScheme } from "../redux/ColorSlice";
import HomeScreen from "./HomeScreen";
import Pomodoro from "./PomodoroScreen";
import ReminderScreen from "./ReminderScreen";
import SettingsScreen from "./SettingsScreen";
import TimerScreen from "./TimerScreen";

const ColorPickerScreen = () => {
	const dispatch = useDispatch();
	const color = useSelector((state) => state.colors);
	// let color = "hello";
	const Data = [
		{
			name: "Slate moss",
			backgroundColor: "#191F2C",
			levelOne: "#2B3748",
			levelTwo: "#445168",
			levelThree: "#586781",
			levelFour: "#97A7C2",
			textColorLight: "#D7D7D7", // light
			textColorDark: "#BECADE", // dark
			accentColor: "#00D34B",
			statusbarTheme: "light",
		},
		{
			name: "Rose gold",
			backgroundColor: "#8E344F",
			levelOne: "#A25268",
			levelTwo: "#B5707F",
			levelThree: "#D092A1",
			levelFour: "#ECB6BF",
			textColorLight: "#FFFFFF",
			textColorDark: "#D4BFBA",
			accentColor: "#4B0C29",
			statusbarTheme: "light",
		},
		{
			// Pineapple under the sea
			name: "Pineapple under the sea",
			backgroundColor: "#00468B",
			levelOne: "#118FC8",
			levelTwo: "#2ECAE9",
			levelThree: "#8EECFE",
			levelFour: "#A6EBF8",
			textColorLight: "#D9F8FF",
			textColorDark: "#454545",
			accentColor: "#FFE35B",
			statusbarTheme: "light",
		},
		{
			// very black
			name: "Very black",
			backgroundColor: "#000000",
			levelOne: "#292A2A",
			levelTwo: "#494949",
			levelThree: "#656565",
			levelFour: "#767676",
			textColorLight: "#D9D9D9",
			textColorDark: "#000000",
			accentColor: "#C6C6C6",
			statusbarTheme: "light",
		},
		{
			//white
			name: "Regal White",
			backgroundColor: "#F9F9FA",
			levelOne: "#EBEEEF",
			levelTwo: "#DDE1E3",
			levelThree: "#CED3D7",
			levelFour: "#BDC5C9",
			textColorLight: "#d6d6d6",
			textColorDark: "#343434",
			accentColor: "#670299",
			statusbarTheme: "dark",
		},
		{
			// sunset forest
			name: "Halloween",
			backgroundColor: "#30301B",
			levelOne: "#2F4F31",
			levelTwo: "#698366",
			levelThree: "#D6B16F",
			levelFour: "#E2822C",
			textColorLight: "#FFD8C5",
			textColorDark: "#311600",
			accentColor: "#DB5B1E",
			statusbarTheme: "light",
		},
		{
			name: "Muted Forest",
			backgroundColor: "#162F20",
			levelOne: "#2F573B",
			levelTwo: "#83A684",
			levelThree: "#6C8D9A",
			levelFour: "#C3D0D6",
			textColorLight: "#E6F2F7",
			textColorDark: "#D7FAE1",
			accentColor: "#E4C3AD",
			statusbarTheme: "light",
		},
	];

	const setColors = (
		backgroundColor,
		levelOne,
		levelTwo,
		levelThree,
		levelFour,
		textColorLight,
		textColorDark,
		accentColor,
		name,
		statusbarTheme
	) => {
		dispatch(
			changeColorScheme({
				backgroundColor: backgroundColor,
				levelOne: levelOne,
				levelTwo: levelTwo,
				levelThree: levelThree,
				levelFour: levelFour,
				textColorLight: textColorLight,
				textColorDark: textColorDark,
				accentColor: accentColor,
				name: name,
				statusbarTheme: statusbarTheme,
			})
		);
	};

	const renderItem = ({ item }) => {
		const object = JSON.parse(JSON.stringify(item));

		return (
			// <ListItemGeneric text={item.name} listItemStyle={styles.listItemStyle}>
			<Pressable
				onPress={() => {
					setColors(
						object.backgroundColor,
						object.levelOne,
						object.levelTwo,
						object.levelThree,
						object.levelFour,
						object.textColorLight,
						object.textColorDark,
						object.accentColor,
						object.name,
						object.statusbarTheme
					);
				}}
				style={{
					flexDirection: "row",
					height: 50,
					width: 50,
					borderRadius: 50,
					overflow: "hidden",
					marginHorizontal: 20,
					elevation: 3,
				}}
			>
				<View style={{ flex: 1, backgroundColor: object.levelOne }}></View>
				<View style={{ flex: 1, backgroundColor: object.accentColor }}></View>
			</Pressable>
			// </ListItemGeneric>
		);
	};

	const data = [
		{
			component: <Pomodoro />,
			id: 1,
		},
		{
			component: <ReminderScreen />,
			id: 2,
		},
		{
			component: <HomeScreen />,
			id: 3,
		},
		{
			component: <SettingsScreen />,
			id: 4,
		},
		{
			component: <TimerScreen />,
			id: 5,
		},
	];

	const renderItemComponent = ({ item }) => {
		return (
			<View
				style={[
					styles.container,
					{ borderWidth: 4, borderColor: color.textColorLight },
				]}
				pointerEvents="none"
			>
				{item.component}
			</View>
		);
	};
	return (
		<View
			style={[styles.rootContainer, { backgroundColor: color.backgroundColor }]}
		>
			<View style={[styles.previewContainer]}>
				<FlatList
					data={data}
					style={{ maxHeight: Dimensions.get("window").height - 100 }}
					renderItem={renderItemComponent}
					horizontal
					keyExtractor={(item) => item.id}
					showsHorizontalScrollIndicator={false}
					initialNumToRender={1}
				/>
			</View>
			<Text style={{ color: color.textColorLight, paddingBottom: 5 }}>
				Try swiping right or left
			</Text>
			<View style={[styles.colorHolder]}>
				<Text style={styles.titleText}>{color.name}</Text>
				<VirtualizedList
					contentContainerStyle={{
						alignItems: "center",
						justifyContent: "space-evenly",
						// flex: 1,
					}}
					horizontal
					data={Data}
					getItem={(data, index) => data[index]}
					getItemCount={(data) => data.length}
					renderItem={(item) => renderItem(item)}
					keyExtractor={(item) => item.backgroundColor}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: Dimensions.get("screen").width,
		height: Dimensions.get("screen").height,
		transform: [{ scale: 0.7 }],
		borderRadius: 30,
		overflow: "hidden",
		alignSelf: "center",
		elevation: 15,
	},
	rootContainer: {
		flex: 1,
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
	},
	previewContainer: {
		// paddingTop: 30,
		// flex: 6,
		flex: 10,
		justifyContent: "center",
		alignContent: "center",
		flexDirection: "row",
		alignItems: "center",
	},
	colorHolder: {
		flex: 2,
		// backgroundColor: "red",
		// marginTop: 30,
	},
	scrollview: {
		// justifyContent: "center",
		alignItems: "center",
	},
	titleText: {
		padding: 10,
		backgroundColor: "#DDDDDD",
		textAlign: "center",
		borderRadius: 10,
		fontWeight: "bold",
		fontSize: 20,
		// elevation: 4,
	},
});

export default ColorPickerScreen;

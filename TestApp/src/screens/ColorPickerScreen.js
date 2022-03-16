import React from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	Dimensions,
	Pressable,
	VirtualizedList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import HomeScreen from "./HomeScreen";
import Pomodoro from "./PomodoroScreen";
import { changeColorScheme } from "../redux/ColorSlice";
import ListItemGeneric from "../components/ListItemGeneric";
import { StatusBar } from "expo-status-bar";

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
			textColor: "#D7D7D7", //light
			textColorTwo: "#BECADE", //dark
			accentColor: "#00D34B",
		},
		{
			name: "Rose gold",
			backgroundColor: "#A86452",
			levelOne: "#CDA398",
			levelTwo: "#FDC3B8",
			levelThree: "#EFCAC3",
			levelFour: "#FBCEC5",
			textColor: "#E7D0D4",
			textColorTwo: "#454545",
			accentColor: "#7D4348",
		},
		{
			//Pineapple under the sea
			name: "Pineapple under the sea",
			backgroundColor: "#00468B",
			levelOne: "#118FC8",
			levelTwo: "#2ECAE9",
			levelThree: "#8EECFE",
			levelFour: "#A6EBF8",
			textColor: "#D9F8FF",
			textColorTwo: "#454545",
			accentColor: "#FFE35B",
		},
		{
			//very black
			name: "Very black",
			backgroundColor: "#000000",
			levelOne: "#292A2A",
			levelTwo: "#494949",
			levelThree: "#656565",
			levelFour: "#767676",
			textColor: "#D9D9D9",
			textColorTwo: "#000000",
			accentColor: "#C6C6C6",
		},
		{
			// sea green
			name: "Sea green",
			backgroundColor: "#130050",
			levelOne: "#152068",
			levelTwo: "#25497F",
			levelThree: "#367997",
			levelFour: "#4EADAF",
			textColor: "#B3CFF7",
			textColorTwo: "#001423",
			accentColor: "#38D9DD",
		},
		{
			// sunset forest
			name: "Sunset forest",
			backgroundColor: "#30301B",
			levelOne: "#2F4F31",
			levelTwo: "#698366",
			levelThree: "#D6B16F",
			levelFour: "#E2822C",
			textColor: "#FFD8C5",
			textColorTwo: "#311600",
			accentColor: "#DB5B1E",
		},
	];

	const setColors = (
		backgroundColor,
		levelOne,
		levelTwo,
		levelThree,
		levelFour,
		textColor,
		textColorTwo,
		accentColor,
		name
	) => {
		dispatch(
			changeColorScheme({
				backgroundColor: backgroundColor,
				levelOne: levelOne,
				levelTwo: levelTwo,
				levelThree: levelThree,
				levelFour: levelFour,
				textColor: textColor,
				textColorTwo: textColorTwo,
				accentColor: accentColor,
				name: name,
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
						object.textColor,
						object.textColorTwo,
						object.accentColor,
						object.name
					);
				}}
				style={{
					flexDirection: "row",
					height: 50,
					width: 50,
					borderRadius: 50,
					overflow: "hidden",
					marginHorizontal: 20,
				}}
			>
				<View style={{ flex: 1, backgroundColor: object.levelOne }}></View>
				<View style={{ flex: 1, backgroundColor: object.accentColor }}></View>
			</Pressable>
			// </ListItemGeneric>
		);
	};

	return (
		<View style={styles.rootContainer}>
			<View style={styles.previewContainer}>
				<View style={styles.container} pointerEvents="none">
					<Pomodoro />
				</View>
				{/* <View style={styles.container} pointerEvents="none">
						<HomeScreen />
					</View> */}
			</View>
			<Text style={styles.titleText}>{color.name}</Text>
			<View style={styles.colorHolder}>
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
			<StatusBar style="dark" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: Dimensions.get("screen").width,
		height: Dimensions.get("screen").height,
		transform: [{ scale: 0.72 }],
		borderRadius: 30,
		overflow: "hidden",
		// alignSelf: "center"

		elevation: 10,
	},
	rootContainer: {
		flex: 1,
		marginTop: 20,
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
		// marginTop: 30,
	},
	previewContainer: {
		// paddingTop: 30,
		flex: 6,
		justifyContent: "center",
		alignContent: "center",
		flexDirection: "row",
		alignItems: "center",
	},
	colorHolder: {
		flex: 1,
		// backgroundColor: "red",
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

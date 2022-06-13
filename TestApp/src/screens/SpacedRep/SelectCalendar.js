import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Button,
	TextInput,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import ActionButton from "../../components/ActionButton";
import ImprovedText, {
	getTextColor,
} from "../../components/CustomReactComponent/ImprovedText";
import LoadingPopup from "../../components/LoadingIndicator";
import CustomButton from "../../components/SpacedRep/CustomButton";
import {
	createCalendar,
	getAllEvents,
	getCalendars,
} from "../../extras/BACKEND";
import { setCalID } from "../../redux/GAuthSlice";
import ListEmpty from "../../components/ListEmpty";
import { FontAwesome } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const CalendarItem = ({ item, index, colors, navigation, setIsLoading }) => {
	const dispatch = useDispatch();
	const [noOfEvents, setNoOfEvents] = useState(0);
	const accessToken = useSelector((state) => state.gauth.AuthToken);
	const idtoken = useSelector((state) => state.gauth.idtoken);
	useEffect(() => {
		setIsLoading(true);
		getAllEvents(accessToken, idtoken, item.id).then((res) => {
			setNoOfEvents(res.data.events.length);
			setIsLoading(false);
		});
	}, []);

	return (
		<TouchableOpacity
			onPress={() => {
				dispatch(setCalID({ calendarID: item.id }));
				navigation.navigate("SpacedRepHome");
			}}
		>
			<View style={[styles.item, { backgroundColor: colors.levelOne }]}>
				<ImprovedText
					text={item.summary}
					backgroundColor={colors.levelOne}
					style={styles.itemText}
				/>
				<View style={[{ backgroundColor: colors.accentColor }, styles.color]}>
					<ImprovedText
						backgroundColor={colors.accentColor}
						text={noOfEvents}
						style={{
							fontWeight: "bold",
							fontSize: 20,
							textAlign: "center",
							textAlignVertical: "center",
						}}
					/>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const SelectCalendar = ({ navigation }) => {
	const colors = useSelector((state) => state.colors);
	const accesstoken = useSelector((state) => state.gauth.AuthToken);
	const idtoken = useSelector((state) => state.gauth.idtoken);
	const signedIn = useSelector((state) => state.gauth.isSignedIn);
	const [calendarList, setCalendarList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [textInput, setTextInput] = useState("");

	function refresh() {
		setIsLoading(true);
		getCalendars(accesstoken, idtoken)
			.then((e) => {
				setCalendarList(e.data.calendars);
				setIsLoading(false);
			})
			.catch((e) => console.log(e.response));
	}

	useEffect(() => {
		refresh();
	}, [accesstoken, idtoken]);

	const renderItem = ({ item, index }) => {
		return (
			<CalendarItem
				item={item}
				index={index}
				colors={colors}
				navigation={navigation}
				setIsLoading={setIsLoading}
			/>
		);
	};
	if (!signedIn) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: "black",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<LottieView
					source={require("../../../assets/animations/cal.json")}
					style={{ height: 250, width: 250 }}
					autoPlay
					loop
					speed={0.75}
				/>
				<Button
					title="Sign in"
					onPress={() => navigation.navigate("Settings")}
				/>
			</View>
		);
	}
	return (
		<View
			style={[styles.container, { backgroundColor: colors.backgroundColor }]}
		>
			<View style={styles.textContainer}>
				<Text
					style={{
						color: colors.accentColor,
						fontSize: 37,
						fontWeight: "bold",
						textAlign: "center",
						textAlignVertical: "center",
						textDecorationLine: "underline",
						textDecorationStyle: "dotted",
					}}
				>
					Select Calendar
				</Text>
			</View>
			<View style={styles.listContainer}>
				<FlatList
					data={calendarList}
					ListEmptyComponent={
						<ListEmpty text="No calendars found. Try that button down there" />
					}
					renderItem={renderItem}
					ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
				/>
			</View>
			<View>
				<ActionButton
					onPressOut={() => {
						!isLoading ? setModalVisible(true) : null;
					}}
					icon={
						<FontAwesome
							name="calendar-plus-o"
							size={30}
							color={getTextColor(colors.accentColor)}
						/>
					}
				/>
			</View>
			<Modal isVisible={modalVisible} hardwareAccelerated>
				<View
					style={[styles.modalContainer, { backgroundColor: colors.levelTwo }]}
				>
					<ImprovedText
						backgroundColor={colors.levelTwo}
						text="Give the calendar a name"
						style={styles.modalText}
					/>
					<TextInput
						onChangeText={(e) => setTextInput(e)}
						style={[
							styles.textInput,
							{
								color: getTextColor(colors.levelTwo),
								backgroundColor: colors.levelThree,
							},
						]}
					/>
					<View style={{ flexDirection: "row", height: 45 }}>
						<CustomButton
							text="Cancel"
							callback={() => setModalVisible(false)}
							color="#FC3030"
							textColorLight={"white"}
						/>
						<CustomButton
							text="Confirm"
							callback={() => {
								setIsLoading(true);
								setModalVisible(false);
								createCalendar(accesstoken, idtoken, textInput).then(() =>
									refresh()
								);
							}}
							color="#00D34B"
						/>
					</View>
				</View>
			</Modal>
			{isLoading ? <LoadingPopup customStyles={{ left: 20 }} /> : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	textContainer: {
		margin: 30,
	},
	listContainer: {
		flex: 3,
	},
	item: {
		flex: 1,
		marginHorizontal: 10,
		borderRadius: 10,
		alignContent: "center",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 20,
		flexDirection: "row",
	},
	itemText: {
		fontSize: 19,
	},
	modalContainer: {
		padding: 10,
		borderRadius: 10,
		// flex: 1,
	},
	modalText: {
		paddingVertical: 10,
		fontSize: 20,
		textAlign: "center",
	},
	textInput: {
		padding: 10,
		fontSize: 17,
		marginVertical: 20,
		borderRadius: 10,
	},
	colorHolder: {
		height: 40,
		width: 40,
		backgroundColor: "white",
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		padding: 3,
	},
	color: {
		height: 35,
		width: 35,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default SelectCalendar;

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
	Alert,
	Button,
	Dimensions,
	Image,
	ScrollView,
	SectionList,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { GoogleSignin } from "react-native-google-signin";
import Modal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import ListHeader from "../components/ListHeader";
import SettingsListItem from "../components/Settings/SettingsListItem";
import CustomButton from "../components/SpacedRep/CustomButton";
import SuccessAlert from "../components/SuccessAnimation";
import { createUser, grabData, updateUserData } from "../extras/BACKEND";
import { deleteCalendar } from "../extras/calendar";
import { changeColorScheme } from "../redux/ColorSlice";
import DatePicker from "react-native-date-picker";
import { signIn, signOut } from "../extras/AuthHandler";
import {
	resetGAuth,
	setCalID,
	setGAuthMeta,
	setIdToken,
	setIsSignedIn,
	setShouldSync,
} from "../redux/GAuthSlice";
import { saveData } from "../extras/AuthHandler";
import { batchAdd, deleteAllReminders } from "../redux/ReminderSlice";
import { clearDeadline, setDeadline } from "../redux/DeadlineSlice";
import LoadingPopup from "../components/LoadingIndicator";
import ImprovedText, {
	getTextColor,
} from "../components/CustomReactComponent/ImprovedText";
import { resetTracker } from "../redux/TrackerSlice";

function SettingsScreen({ navigation }) {
	const accessToken = useSelector((state) => state.gauth.AuthToken);
	const signedIn = useSelector((state) => state.gauth.isSignedIn);
	const email = useSelector((state) => state.gauth.email);
	const profile_pic = useSelector((state) => state.gauth.profile_pic);
	const name = useSelector((state) => state.gauth.name);
	const family_name = useSelector((state) => state.gauth.family_name);
	const calID = useSelector((state) => state.gauth.calendarID);
	const shouldSync = useSelector((state) => state.gauth.shouldSync);
	const deadline = useSelector((state) => state.deadline.deadline);
	const [modalVisible, setModalVisible] = useState(false);
	const [calIdVisible, setCalIdVisible] = useState(false);
	const IdToken = useSelector((state) => state.gauth.IdToken);
	const colors = useSelector((state) => state.colors);
	const reminderData = useSelector((state) => state.reminders);
	const [deadLineModal, setDeadLineModal] = useState(false);
	const [date, setDate] = useState(new Date());
	const [text, setText] = useState();
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	function setData(data, timeSince) {
		setLoading(true);
		const seconds = Math.round(timeSince / 1000);
		const minutes = Math.round(seconds / 60);
		const hours = Math.round(minutes / 60);
		const days = Math.round(hours / 24);
		let message = "";

		if (seconds > 1) {
			message =
				"The last backup was created " +
				seconds +
				" seconds ago. Do you want to restore? Restoring will clear all present data in your app and replace it with the backup";
		}
		if (minutes > 0) {
			message =
				"The last backup was created " +
				minutes +
				" minutes ago. Do you want to restore? Restoring will clear all present data in your app and replace it with the backup";
		}
		if (hours > 0) {
			message =
				"The last backup was created " +
				hours +
				" hours ago. Do you want to restore? Restoring will clear all present data in your app and replace it with the backup";
		}
		if (days > 0) {
			message =
				"The last backup was created " +
				days +
				" days ago. Do you want to restore? Restoring will clear all present data in your app and replace it with the backup";
		}

		Alert.alert("Restore?", message, [
			{
				text: "No",
				style: "destructive",
				onPress: () => {
					setLoading(false);
				},
			},
			{
				text: "Yes",
				onPress: () => {
					saveData(data);
				},
				style: "default",
			},
		]);
	}

	function sendData(idToken) {
		setLoading(true);
		AsyncStorage.getItem("pomodoro").then((f) => {
			updateUserData(idToken, {
				calID: calID,
				pomodoros: f,
				reminders: reminderData,
				colors: colors,
				deadline: deadline,
			}).then(() => setLoading(false));
		});
	}
	function fullBackupRestore() {
		grabData(IdToken)
			.then((e) => {
				const data = e.data.data;
				const date = new Date(data.dateUpdated);
				const dateNow = new Date();
				const timeSince = dateNow.getTime() - date.getTime();
				setData(data.data, timeSince);
			})
			.then(() => setLoading(false));
	}
	function dataWipe() {
		AsyncStorage.removeItem("pomodoro").then(() => {
			dispatch(resetGAuth());
		});
	}

	// useEffect(() => {
	// 	return () => {
	// 		dispatch(setDeadline({ deadline: date }));
	// 	};
	// }, [date]);

	const renderItem = ({ item }) => {
		return (
			<SettingsListItem
				callback={item.callback}
				text={item.title}
				subText={item.subText}
				backgroundColor={colors.backgroundColor}
				// subTextColor={colors.textColorDark}
			/>
		);
	};

	// console.log(calID);
	return (
		<View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
			<View style={styles.top}>
				<ImprovedText
					style={{ color: colors.textColorLight, fontSize: 40 }}
					text="Settings"
					backgroundColor={colors.backgroundColor}
				/>
			</View>
			{signedIn ? (
				<View style={styles.accountInfo}>
					<View>
						<Text
							style={[
								styles.accountText,
								styles.name,
								{
									maxWidth: Dimensions.get("window").width - 75,
									color: getTextColor(colors.backgroundColor),
								},
							]}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{name} {family_name}
						</Text>
						<Text
							style={[
								styles.accountText,
								{ color: getTextColor(colors.backgroundColor) },
							]}
						>
							{email}
						</Text>
					</View>
					<View>
						<Image style={styles.profile_pic} source={{ uri: profile_pic }} />
					</View>
				</View>
			) : null}
			<View style={{ flex: 1 }}>
				<SectionList
					renderItem={renderItem}
					sections={[
						{
							title: "Theming",
							iconName: "appstore1",
							data: [
								{
									title: "Colors",
									subText: "Change the look and feel",
									callback: () => navigation.navigate("ColorPicker"),
								},
							],
						},
						{
							title: "General",
							iconName: "swap",
							data: [
								{
									title: "Deadline",
									subText: "Set deadline for homescreen",
									callback: () => {
										setDeadLineModal(true);
										setModalVisible(true);
									},
								},
								{
									title: "Clear Deadline",
									subText: "Reset deadline timer",
									callback: () => {
										dispatch(clearDeadline());
										setModalVisible(true);
									},
								},
								{
									callback: () => {
										setLoading(true);
										AsyncStorage.removeItem("pomodoro").then(() =>
											setModalVisible(true)
										);
									},
									title: "Nuke Pomodoros",
									subText: "Delete all pomodoro presets",
								},
							],
						},
						{
							title: "Accounts",
							iconName: "google",
							data: signedIn
								? [
										{
											callback: () => {
												setLoading(true);
												fullBackupRestore();
											},
											title: "Restore",
											subText: "Restore your data",
										},
										{
											callback: () => {
												setLoading(true);
												sendData(IdToken);
											},
											title: "Backup now",
											subText: "Manual Backup",
										},
										{
											callback: () => {
												console.log(IdToken);
												console.log(accessToken);
											},
											title: "list idtoken",
											subText: "idtoken",
										},
										{
											callback: () => {
												setLoading(true);
												signOut();
												setModalVisible(true);
												dispatch(resetTracker());
												dataWipe();
											},
											title: "Sign out",
											subText:
												"Sign out of you google account. This will disable spaced repetition, and syncing",
										},
								  ]
								: [
										{
											callback: () => {
												setLoading(true);
												signIn().then(() => setModalVisible(true));
											},
											title: "Sign in",
											subText: "Sign in to your google account",
										},
								  ],
						},
					]}
					renderSectionHeader={({ section }) => {
						return (
							<ListHeader
								text={section.title}
								extraStyle={[
									styles.listheader,
									{ backgroundColor: colors.levelOne },
								]}
								iconName={section.iconName}
								onPressCallback={() => {}}
							/>
						);
					}}
					keyExtractor={(item, index) => item.title + item.subText}
					stickySectionHeadersEnabled
				/>
			</View>
			<SuccessAlert
				modalVisible={modalVisible}
				setModalVisible={() => {
					setModalVisible(false);
					setLoading(false);
				}}
			/>
			<Modal
				isVisible={calIdVisible}
				useNativeDriver
				useNativeDriverForBackdrop
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<View style={styles.modal}>
					<Text style={styles.text}>Type in a custom google calendar ID</Text>
					<TextInput
						style={styles.textInput}
						onChangeText={(e) => setText(e)}
					/>
					<View>
						<Button
							title="OK"
							onPress={() => {
								setCalIdVisible(false);
								if (text) {
									dispatch(setCalID({ calendarID: text }));
								}
								setModalVisible(true);
							}}
							color="#00D34B"
						/>
					</View>
				</View>
			</Modal>
			<Modal
				isVisible={deadLineModal}
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<View
					style={{
						backgroundColor: "white",
						padding: 20,
						borderRadius: 10,
						justifyContent: "space-evenly",
					}}
				>
					<DatePicker
						minimumDate={new Date()}
						mode="date"
						date={date}
						onDateChange={(e) => setDate(new Date(e))}
					/>
					<View style={{ height: 50, marginTop: 10, flexDirection: "row" }}>
						<CustomButton
							text="Cancel"
							callback={() => setDeadLineModal(false)}
							color="#FC3030"
							textColorLight={"white"}
						/>
						<CustomButton
							text="Set Deadline"
							callback={() => {
								setDeadLineModal(false);
								dispatch(setDeadline({ deadline: date }));
							}}
							color="#00D34B"
						/>
					</View>
				</View>
			</Modal>
			{loading ? <LoadingPopup /> : null}
		</View>
	);
}
const styles = StyleSheet.create({
	listheader: {
		padding: 10,
		backgroundColor: "#262626",
		marginHorizontal: 3,
		// marginTop: 5,
		borderRadius: 10,
	},
	modal: {
		backgroundColor: "#2B3748",
		height: 250,
		width: 250,
		borderRadius: 7,
		justifyContent: "space-evenly",
		padding: 10,
	},
	textInput: {
		backgroundColor: "#445168",
		padding: 10,
		borderRadius: 5,
		color: "white",
	},
	text: {
		fontSize: 20,
		color: "white",
	},
	top: {
		minHeight: 200,
		justifyContent: "center",
		alignItems: "center",
	},
	accountInfo: {
		minHeight: 100,
		justifyContent: "space-around",
		flexDirection: "row",
		alignItems: "center",
	},
	profile_pic: {
		width: 60,
		height: 60,
		borderRadius: 60,
	},
	accountText: {
		padding: 2,
		color: "white",
		fontSize: 15,
	},
	name: {
		fontSize: 25,
	},
});
export default SettingsScreen;

// backgroundColor: "#191F2C",
// 		levelOne: "#2B3748",
// 		levelTwo: "#445168",
// 		levelThree: "#586781",
// 		levelFour: "#97A7C2",
// 		textColorLight: "#D7D7D7", //light
// 		textColorDark: "#BECADE", //dark
// 		accentColor: "#00D34B",

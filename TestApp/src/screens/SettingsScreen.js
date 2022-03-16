import React, { useState } from "react";
import {
	View,
	Button,
	NativeModules,
	Text,
	ScrollView,
	StyleSheet,
	TextInput,
	Alert,
	Image,
	Dimensions,
} from "react-native";
import SettingsListItem from "../components/Settings/SettingsListItem";
import { GoogleSignin } from "react-native-google-signin";
import {
	setCalID,
	setIsSignedIn,
	setIdToken,
	setShouldSync,
	resetGAuth,
	setGAuthMeta,
} from "../redux/GAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import ListHeader from "../components/ListHeader";
import { deleteCalendar } from "../extras/GAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { batchAdd, deleteAllReminders } from "../redux/ReminderSlice";
import SuccessAlert from "../components/SuccessAnimation";
import { changeColorScheme } from "../redux/ColorSlice";
import Modal from "react-native-modal";
import { createUser, grabData, updateUserData } from "../extras/BACKEND";

function SettingsScreen({ navigation }) {
	const accessToken = useSelector((state) => state.gauth.AuthToken);
	const signedIn = useSelector((state) => state.gauth.isSignedIn);
	const email = useSelector((state) => state.gauth.email);
	const profile_pic = useSelector((state) => state.gauth.profile_pic);
	const name = useSelector((state) => state.gauth.name);
	const family_name = useSelector((state) => state.gauth.family_name);
	const calID = useSelector((state) => state.gauth.calendarID);
	const shouldSync = useSelector((state) => state.gauth.shouldSync);
	const [modalVisible, setModalVisible] = useState(false);
	const [calIdVisible, setCalIdVisible] = useState(false);
	const IdToken = useSelector((state) => state.gauth.IdToken);
	const colors = useSelector((state) => state.colors);
	const reminderList = useSelector((state) => state.reminders);
	const [text, setText] = useState();
	const dispatch = useDispatch();

	function saveData(data) {
		dispatch(setCalID({ calendarID: data.calID }));
		dispatch(batchAdd({ data: data.reminders.reminders }));
		dispatch(
			changeColorScheme({
				backgroundColor: data.colors.backgroundColor,
				levelOne: data.colors.levelOne,
				levelTwo: data.colors.levelTwo,
				levelThree: data.colors.levelThree,
				levelFour: data.colors.levelFour,
				textColor: data.colors.textColor,
				textColorTwo: data.colors.textColorTwo,
				accentColor: data.colors.accentColor,
			})
		);
		AsyncStorage.setItem("pomodoro", data.pomodoros).then(() =>
			setModalVisible(true)
		);
	}

	function setData(data, timeSince) {
		console.log(timeSince);
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
			},
			{
				text: "Yes",
				onPress: () => saveData(data),
				style: "default",
			},
		]);
	}

	function sendData(idToken) {
		AsyncStorage.getItem("pomodoro").then((f) => {
			console.log(f);
			updateUserData(idToken, {
				calID: calID,
				pomodoros: f,
				reminders: reminderList,
				colors: colors,
			});
		});
	}
	function fullBackupRestore() {
		GoogleSignin.signInSilently().then((e) => {
			grabData(e.idToken).then((e) => {
				const data = e.data.data;
				const date = new Date(data.dateUpdated);
				const dateNow = new Date();
				const timeSince = dateNow.getTime() - date.getTime();
				setData(data.data, timeSince);
			});
		});
	}
	function dataWipe() {
		AsyncStorage.removeItem("pomodoro").then(() => {
			dispatch(resetGAuth());
		});
	}

	console.log(calID);
	return (
		<View style={{ flex: 1, backgroundColor: "black" }}>
			<ScrollView>
				<View style={styles.top}>
					<Text style={{ color: "white", fontSize: 40 }}>Settings</Text>
				</View>
				{signedIn ? (
					<View style={styles.accountInfo}>
						<View>
							<Text
								style={[
									styles.accountText,
									styles.name,
									{ maxWidth: Dimensions.get("window").width - 75 },
								]}
								numberOfLines={1}
								ellipsizeMode="tail"
							>
								{name} {family_name}
							</Text>
							<Text style={[styles.accountText]}>{email}</Text>
						</View>
						<View>
							<Image style={styles.profile_pic} source={{ uri: profile_pic }} />
						</View>
					</View>
				) : null}
				<View style={{ marginTop: 0 }}>
					<ListHeader
						text="Themes"
						extraStyle={styles.listheader}
						iconName="appstore1"
						onPressCallback={() => {}}
					/>
					<SettingsListItem
						callback={() => navigation.navigate("ColorPicker")}
						text="Colors"
						subText="Change the look and feel"
					/>
					<ListHeader
						text="Calendar"
						extraStyle={styles.listheader}
						iconName="calendar"
						onPressCallback={() => {}}
					/>
					<SettingsListItem
						callback={() =>
							deleteCalendar(accessToken, calID)
								.then(() => {
									dispatch(setCalID({ calendarID: null }));
									setModalVisible(true);
								})
								.catch(() => {
									dispatch(setCalID({ calendarID: null }));
									setModalVisible(true);
								})
						}
						text="Nuke Calendar"
						subText="Delete my spaced repetition calendar and all its events"
					/>
					<SettingsListItem
						callback={() => setCalIdVisible(true)}
						text="Add Custom Calendar"
						subText="Add custom google calendar."
					/>
					<ListHeader
						text="General"
						extraStyle={styles.listheader}
						iconName="swap"
						onPressCallback={() => {}}
					/>
					<SettingsListItem
						callback={() => {
							AsyncStorage.removeItem("pomodoro").then(() =>
								setModalVisible(true)
							);
						}}
						text="Nuke Pomodoros"
						subText="Delete all pomodoro presets"
					/>
					<SettingsListItem
						callback={() => {
							setModalVisible(true);
							dispatch(deleteAllReminders());
						}}
						text="Nuke Reminders"
						subText="Delete all reminders"
					/>
					<ListHeader
						text="Accounts"
						extraStyle={styles.listheader}
						iconName="google"
						onPressCallback={() => {}}
					/>

					{!signedIn ? (
						<SettingsListItem
							callback={() => {
								GoogleSignin.signIn().then((e) => {
									dispatch(setIsSignedIn({ isSignedIn: true }));
									grabData(e.idToken).then((e) => {
										const data = e.data.data.data;
										const family_name = e.data.data.family_name;
										const name = e.data.data.name;
										const profile_pic = e.data.data.profile_pic;
										const email = e.data.data.email;
										const calId = e.data.data.data.calID;
										dispatch(
											setGAuthMeta({
												family_name: family_name,
												name: name,
												profile_pic: profile_pic,
												email: email,
											})
										);
										dispatch(setCalID({ calendarID: calId }));
										dispatch(setShouldSync({ shouldSync: true }));
										saveData(data);
									});
								});
							}}
							text="Sign in"
							subText="Sign in to your google account"
						/>
					) : null}

					{signedIn ? (
						<>
							<SettingsListItem
								callback={() => {
									fullBackupRestore();
								}}
								text="Restore"
								subText="Restore your data"
							/>
							<SettingsListItem
								callback={() => {
									GoogleSignin.signInSilently().then((e) => {
										sendData(e.idToken);
									});
								}}
								text="Backup now"
								subText="Manual Backup"
							/>
							<SettingsListItem
								callback={() => {
									GoogleSignin.signInSilently()
										.then((e) => {
											createUser(e.idToken).then(() => {
												sendData(e.idToken);
												dispatch(setShouldSync({ shouldSync: !shouldSync }));
											});

											dispatch(setIdToken({ IdToken: e.idToken }));
											setModalVisible(true);
										})
										.catch(() =>
											Alert.alert(
												"Sign in Required",
												"Google sign in required to authenticate to GetItDone servers"
											)
										);
								}}
								text="Sync"
								subText={
									shouldSync ? "Sync is turned on" : "Sync is turned off"
								}
							/>
							<SettingsListItem
								callback={() => {
									GoogleSignin.signInSilently().then((e) => {
										sendData(e.idToken);
										GoogleSignin.signOut().then((e) => {
											dataWipe();
											setModalVisible(true);
										});
									});
								}}
								text="Sign out"
								subText="Sign out of you google account. This will disable spaced repetition, and syncing"
							/>
						</>
					) : null}
				</View>
				<SuccessAlert
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
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
			</ScrollView>
		</View>
	);
}
const styles = StyleSheet.create({
	listheader: {
		padding: 10,
		backgroundColor: "#262626",
		marginHorizontal: 3,
		marginTop: 5,
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
		minHeight: 250,
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
// 		textColor: "#D7D7D7", //light
// 		textColorTwo: "#BECADE", //dark
// 		accentColor: "#00D34B",

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { AppState, View } from "react-native";
import { GoogleSignin } from "react-native-google-signin";
import { useDispatch, useSelector } from "react-redux";
import { getCalId, grabData, updateUserData } from "../extras/BACKEND";
import {
	setCalID,
	setGAuthMeta,
	setIsSignedIn,
	setToken,
} from "../redux/GAuthSlice";

const TopLevelContainer = ({ children }) => {
	// const signedIn = useSelector((state) => state.gauth.isSignedIn);
	// const shouldSync = useSelector((state) => state.gauth.shouldSync);
	// const calID = useSelector((state) => state.gauth.calendarID);
	const colors = useSelector((state) => state.colors);
	const accesstoken = useSelector((state) => state.gauth.AuthToken);
	const idtoken = useSelector((state) => state.gauth.IdToken);
	const gauth = useSelector((state) => state.gauth);
	// const reminderData = useSelector((state) => state.reminders);
	const dispatch = useDispatch();
	// console.log(gauth);

	// function sendData(idToken) {
	// 	AsyncStorage.getItem("pomodoro").then((f) => {
	// 		updateUserData(idToken, {
	// 			calID: calID,
	// 			pomodoros: f,
	// 			reminders: reminderData,
	// 			colors: colors,
	// 		}).then(() => console.log("backed up"));
	// 	});
	// }
	// const handleAppStateChange = (nextAppState) => {
	// 	if (nextAppState === "background") {
	// 		if (signedIn && shouldSync) {
	// 			GoogleSignin.signInSilently().then((e) => {
	// 				sendData(e.idToken);
	// 			});
	// 		}
	// 	}
	// };
	//setting the calID
	useEffect(() => {
		const result = getCalId(accesstoken, idtoken);
		result.then((e) => {
			dispatch(setCalID({ calendarID: e.data.calendarId }));
		});
	}, []);

	// useEffect(() => {
	// 	if (signedIn) {
	// 		GoogleSignin.signInSilently().then((e) => {
	// 			GoogleSignin.getTokens().then((e) => {
	// 				dispatch(setToken({ AuthToken: e.accessToken }));
	// 			});
	// 			grabData(e.idToken).then((e) => {
	// 				const family_name = e.data.data.family_name;
	// 				const name = e.data.data.name;
	// 				const profile_pic = e.data.data.profile_pic;
	// 				const email = e.data.data.email;
	// 				const calId = e.data.data.data.calID;
	// 				dispatch(
	// 					setGAuthMeta({
	// 						family_name: family_name,
	// 						name: name,
	// 						profile_pic: profile_pic,
	// 						email: email,
	// 					})
	// 				);
	// 				dispatch(setCalID({ calendarID: calId }));
	// 			});
	// 		});
	// 	} else {
	// 		dispatch(setIsSignedIn({ isSignedIn: false }));
	// 	}
	// }, [signedIn]);

	return (
		<>
			<View
				style={{
					backgroundColor: colors.backgroundColor,
					zIndex: -10,
				}}
			></View>
			{children}
			<StatusBar style={colors.statusbarTheme} />
		</>
	);
};

export { TopLevelContainer };

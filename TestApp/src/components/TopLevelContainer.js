import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { AppState, View } from "react-native";
import { GoogleSignin } from "react-native-google-signin";
import { useDispatch, useSelector } from "react-redux";
import { grabData, updateUserData } from "../extras/BACKEND";
import {
	setCalID,
	setGAuthMeta,
	setIsSignedIn,
	setToken,
} from "../redux/GAuthSlice";

const TopLevelContainer = (props) => {
	const signedIn = useSelector((state) => state.gauth.isSignedIn);
	const shouldSync = useSelector((state) => state.gauth.shouldSync);
	const calID = useSelector((state) => state.gauth.calendarID);
	const colors = useSelector((state) => state.colors);
	const reminderList = useSelector((state) => state.reminders);
	const dispatch = useDispatch();

	function sendData(idToken) {
		AsyncStorage.getItem("pomodoro").then((f) => {
			updateUserData(idToken, {
				calID: calID,
				pomodoros: f,
				reminders: reminderList,
				colors: colors,
			}).then(() => console.log("backed up"));
		});
	}
	const handleAppStateChange = (nextAppState) => {
		if (nextAppState === "background") {
			if (signedIn && shouldSync) {
				GoogleSignin.signInSilently().then((e) => {
					sendData(e.idToken);
				});
			}
		}
	};
	useEffect(() => {
		const eventSub = AppState.addEventListener("change", handleAppStateChange);
		const interval = setInterval(() => {
			if (signedIn && shouldSync) {
				GoogleSignin.signInSilently().then((e) => {
					sendData(e.idToken);
				});
			}
		}, 1000 * 60 * 5);
		return () => {
			clearInterval(interval);
			try {
				eventSub.remove();
			} catch {}
		};
	}, [shouldSync]);

	useEffect(() => {
		if (signedIn) {
			GoogleSignin.signInSilently().then((e) => {
				GoogleSignin.getTokens().then((e) => {
					// console.log(e.idToken);
					dispatch(setToken({ AuthToken: e.accessToken }));
				});
				grabData(e.idToken).then((e) => {
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
				});
			});
		} else {
			dispatch(setIsSignedIn({ isSignedIn: false }));
		}
	}, [signedIn]);

	return (
		<View
			style={{
				flex: 1,
				paddingTop: 25,
				backgroundColor: colors.backgroundColor,
			}}
		>
			{props.children}
		</View>
	);
};

export { TopLevelContainer };

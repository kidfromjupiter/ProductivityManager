import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
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
import { store } from "../redux/store";
import { getTextColor } from "./CustomReactComponent/ImprovedText";
import BackgroundTimer from "react-native-background-timer-android";
import { useRoute } from "@react-navigation/native";
import {
	reset,
	_SET_breakTimeTot,
	_SET_screentime,
	_SET_sessionTimeTot,
	_SET_dateModified,
	setNewDay,
} from "../redux/TrackerSlice";
import Analytics from "../extras/classes/AnalyticsClass";

const TopLevelContainer = ({ children, currentScreen }) => {
	const colors = useSelector((state) => state.colors);
	const pomodoro = useSelector((state) => state.pomodoro);
	const tracker = useSelector((state) => state.tracker);
	const [sessionTime, setSessionTime] = useState(tracker.sessionTimeTot);
	const [breakTime, setBreakTime] = useState(tracker.breakTimeTot);
	const [screenTime, setScreenTime] = useState(() => {
		const { Home, Reminders, SpacedRep, Timer, Settings } = tracker.screenTime;

		return {
			Home: Home,
			Reminders: Reminders,
			SpacedRep: SpacedRep,
			Timer: Timer,
			Settings: Settings,
		};
	});

	const dispatch = useDispatch();

	// tracker setup
	useEffect(() => {
		const today = new Date().toISOString().substring(0, 10);
		// const today = "2022-10-28";
		if (!tracker.dateModified) {
			dispatch(_SET_dateModified({ date: today }));
		} else if (tracker.dateModified !== today) {
			dispatch(setNewDay());
		}
	}, []);

	useEffect(() => {
		if (pomodoro.isSession && pomodoro.isRunning) {
			const interval = BackgroundTimer.setInterval(() => {
				// dispatch(_SET_sessionTimeTot({ time: tracker.sessionTimeTot + 1 }));
				setSessionTime(sessionTime + 1);
			}, 1000);
			return () => {
				dispatch(_SET_sessionTimeTot({ time: sessionTime }));
				BackgroundTimer.clearInterval(interval);
			};
		}
		if (!pomodoro.isSession && pomodoro.isRunning) {
			const interval = BackgroundTimer.setInterval(() => {
				setBreakTime(breakTime + 1);
			}, 1000);
			return () => {
				dispatch(_SET_breakTimeTot({ time: breakTime }));
				BackgroundTimer.clearInterval(interval);
			};
		}
		if (
			!pomodoro.isRunning &&
			pomodoro.time > 0 &&
			currentScreen == "Pomodoro"
		) {
			const interval = BackgroundTimer.setInterval(() => {
				setBreakTime(breakTime + 1);
			}, 1000);
			return () => {
				dispatch(_SET_breakTimeTot({ time: breakTime }));
				BackgroundTimer.clearInterval(interval);
			};
		}
	}, [
		pomodoro.isSession,
		pomodoro.isRunning,
		sessionTime,
		breakTime,
		currentScreen,
	]);

	//screentime counter
	useEffect(() => {
		const { Home, Reminders, SpacedRep, Timer, Settings } = tracker.screenTime;
		switch (currentScreen) {
			case "Settings":
				const settingstimer = setInterval(() => {
					dispatch(
						_SET_screentime({ ...tracker.screenTime, Settings: Settings + 1 })
					);
				}, 1000);
				return () => {
					clearInterval(settingstimer);
				};
			case "OngoingReminders":
			case "CompletedReminders":
				const reminderstimer = setInterval(() => {
					dispatch(
						_SET_screentime({ ...tracker.screenTime, Reminders: Reminders + 1 })
					);
				}, 1000);
				return () => {
					clearInterval(reminderstimer);
				};
			case "Spaced Repetition":
			case "SpacedRepList":
			case "SpacedRepHome":
				const spacedreptimer = setInterval(() => {
					dispatch(
						_SET_screentime({ ...tracker.screenTime, SpacedRep: SpacedRep + 1 })
					);
				}, 1000);
				return () => {
					clearInterval(spacedreptimer);
				};
			case "Timer":
				const timer_time = setInterval(() => {
					dispatch(
						_SET_screentime({ ...tracker.screenTime, Timer: Timer + 1 })
					);
				}, 1000);
				return () => {
					clearInterval(timer_time);
				};
			case "Home":
				const hometimer = setInterval(() => {
					dispatch(_SET_screentime({ ...tracker.screenTime, Home: Home + 1 }));
				}, 1000);
				return () => {
					clearInterval(hometimer);
				};
			default:
				break;
		}
	}, [tracker.screenTime, currentScreen]);

	// console.log(
	// 	JSON.stringify(
	// 		new Analytics(
	// 			tracker.breakTimeTot,
	// 			tracker.sessionTimeTot,
	// 			tracker.screenTime,
	// 			tracker.trackingData,
	// 			tracker.dateModified
	// 		)
	// 	)
	// );
	// BackgroundTimer.setInterval(() => {
	// 	console.log("hello");
	// }, 1000);

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

	//setting the calID
	// useEffect(() => {
	// 	const result = getCalId(accesstoken, idtoken);
	// 	result.then((e) => {
	// 		dispatch(setCalID({ calendarID: e.data.calendarId }));
	// 	});
	// }, []);

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
					flex: 1,
				}}
			>
				{children}
				<StatusBar style={colors.statusbarTheme} />
			</View>
		</>
	);
};

export { TopLevelContainer };

import {
	authorize,
	prefetchConfiguration,
	refresh,
	revoke,
} from "react-native-app-auth";
import { grabData } from "./BACKEND";
import {
	setGAuth,
	setIsSignedIn,
	setGAuthMeta,
	setCalID,
	setShouldSync,
	resetGAuth,
} from "../redux/GAuthSlice";
import { store } from "../redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { batchAdd } from "../redux/ReminderSlice";
import { changeColorScheme } from "../redux/ColorSlice";
import { GoogleSignin } from "react-native-google-signin";
const config = {
	issuer: "https://accounts.google.com",
	clientId:
		"828611517945-1j64mv1irokorth2rc4333dm3tctq3hi.apps.googleusercontent.com",

	redirectUrl: "getitdone.com:/",
	scopes: [
		"https://www.googleapis.com/auth/calendar",
		"https://www.googleapis.com/auth/calendar.events",
		"openid",
		"https://www.googleapis.com/auth/userinfo.profile",
		"https://www.googleapis.com/auth/userinfo.email",
	],
};

function dataWipe() {
	store.dispatch(resetGAuth());
	AsyncStorage.removeItem("pomodoro");
}

export function saveData(data) {
	store.dispatch(setCalID({ calendarID: data.calID }));
	store.dispatch(
		batchAdd({
			reminders: data.reminders.reminders,
			completed: data.reminders.completed,
		})
	);
	store.dispatch(
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
	AsyncStorage.setItem("pomodoro", data.pomodoros);
}

function setState(accessToken, IdToken) {
	store.dispatch(
		setGAuth({
			AuthToken: accessToken,
			state: "success",
			IdToken: IdToken,
		})
	);
}

export async function signIn() {
	const signedIn = store.getState().gauth.isSignedIn;
	try {
		// const authState = await authorize(config);
		if (!signedIn) {
			GoogleSignin.signIn().then(() => {
				GoogleSignin.getTokens().then((e) => {
					setState(e.accessToken, e.idToken);

					grabData(e.idToken).then((e) => {
						const data = e.data.data.data;
						const family_name = e.data.data.family_name;
						const name = e.data.data.name;
						const profile_pic = e.data.data.profile_pic;
						const email = e.data.data.email;
						const calId = e.data.data.data.calID;
						store.dispatch(
							setGAuthMeta({
								family_name: family_name,
								name: name,
								profile_pic: profile_pic,
								email: email,
							})
						);
						store.dispatch(setCalID({ calendarID: calId }));
						store.dispatch(setShouldSync({ shouldSync: true }));
						saveData(data);
						store.dispatch(setIsSignedIn({ isSignedIn: true }));
					});
				});
			});
		} else {
			GoogleSignin.signInSilently().then(() => {
				GoogleSignin.getTokens().then((e) => {
					setState(e.accessToken, e.idToken);

					grabData(e.idToken).then((e) => {
						const data = e.data.data.data;
						const family_name = e.data.data.family_name;
						const name = e.data.data.name;
						const profile_pic = e.data.data.profile_pic;
						const email = e.data.data.email;
						const calId = e.data.data.data.calID;
						store.dispatch(
							setGAuthMeta({
								family_name: family_name,
								name: name,
								profile_pic: profile_pic,
								email: email,
							})
						);
						store.dispatch(setCalID({ calendarID: calId }));
						store.dispatch(setShouldSync({ shouldSync: true }));
						saveData(data);
						store.dispatch(setIsSignedIn({ isSignedIn: true }));
					});
				});
			});
		}

		// 	setState(
		// 		// authState.accessToken,
		// 		// authState.refreshToken,
		// 		// authState.accessTokenExpirationDate,
		// 		// authState.idToken
		// 		authState.
		// 	);
		//
	} catch (error) {
		console.log(error);
		store.dispatch(setGAuth({ state: "error" }));
	}
}

export async function signOut() {
	GoogleSignin.signOut().then(() => dataWipe());
}

export async function refreshAccessToken() {
	const signIn = await GoogleSignin.signInSilently();
	return GoogleSignin.getTokens().then((e) => {
		setState(e.accessToken, e.idToken);
		return Promise.resolve(e);
	});
}

import { createSlice } from "@reduxjs/toolkit";

export const GSlice = createSlice({
	name: "gauth",
	initialState: {
		AuthToken: null,
		calendarId: null,
		expiry: null,
		issuedAt: null,
		shouldRefresh: null,
		isSignedIn: false,
		idtoken: null,
		shouldSync: false,
		email: null,
		profile_pic: null,
		family_name: null,
		name: null,
		state: null,
		refresh_token: null,
		refreshing: false,
	},
	reducers: {
		setToken: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.AuthToken = action.payload.AuthToken;
			return localState;
		},
		setGAuth: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.AuthToken = action.payload.AuthToken;
			// localState.profilepic = action.payload.profilepic;
			// localState.email = action.payload.email;
			!localState.refresh_token
				? (localState.refresh_token = action.payload.refresh_token)
				: null;
			localState.expiry = action.payload.expiry;
			localState.state = action.payload.state;
			localState.idtoken = action.payload.idtoken;
			return localState;
		},
		setGAuthMeta: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.profile_pic = action.payload.profile_pic;
			localState.email = action.payload.email;
			localState.name = action.payload.name;
			localState.family_name = action.payload.family_name;
			return localState;
		},
		setCalID: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.calendarId = action.payload.calendarID;
			return localState;
		},
		setRefreshNeeded: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.shouldRefresh = action.payload.shouldRefresh;
			return localState;
		},
		setIsSignedIn: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.isSignedIn = action.payload.isSignedIn;
			return localState;
		},
		setidtoken: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.idtoken = action.payload.idtoken;
			return localState;
		},
		setShouldSync: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.shouldSync = action.payload.shouldSync;
			return localState;
		},
		resetGAuth: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.AuthToken = null;
			localState.calendarID = null;
			localState.expiry = null;
			localState.issuedAt = null;
			localState.shouldRefresh = null;
			localState.isSignedIn = false;
			localState.idtoken = null;
			localState.shouldSync = false;
			localState.email = null;
			localState.profile_pic = null;
			localState.name = null;
			localState.family_name = null;
			localState.state = null;
			return localState;
		},
		setRefreshing: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.refreshing = action.payload.refreshing;
			return localState;
		},
	},
});

export const {
	setToken,
	setGAuth,
	setCalID,
	setRefreshNeeded,
	setIsSignedIn,
	setidtoken,
	setShouldSync,
	resetGAuth,
	setGAuthMeta,
	setRefreshing,
} = GSlice.actions;
export default GSlice.reducer;

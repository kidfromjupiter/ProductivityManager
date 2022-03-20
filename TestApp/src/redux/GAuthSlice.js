import { createSlice } from '@reduxjs/toolkit';

export const GSlice = createSlice({
	name: 'gauth',
	initialState: {
		AuthToken: null,
		calendarID: null,
		expiry: null,
		issuedAt: null,
		shouldRefresh: null,
		isSignedIn: false,
		IdToken: null,
		shouldSync: false,
		email: null,
		profile_pic: null,
		family_name: null,
		name: null,
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
			// localState.refresh_token = action.payload.refresh_token;
			localState.expiry = action.payload.expiry;
			localState.issuedAt = action.payload.issuedAt;
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
			localState.calendarID = action.payload.calendarID;
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
		setIdToken: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.IdToken = action.payload.IdToken;
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
			localState.IdToken = null;
			localState.shouldSync = false;
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
	setIdToken,
	setShouldSync,
	resetGAuth,
	setGAuthMeta,
} = GSlice.actions;
export default GSlice.reducer;

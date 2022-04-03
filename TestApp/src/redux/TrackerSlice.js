import { createSlice } from "@reduxjs/toolkit";

export const TrackerSlice = createSlice({
	name: "tracker",
	initialState: {
		trackingData: [],
	},
	reducers: {
		logData: (state, actions) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.trackingData.push(actions.payload);
			return localState;
		},
		reset: (state) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.trackingData = [];
			return localState;
		},
	},
});

export const { logData, reset } = TrackerSlice.actions;
export default TrackerSlice.reducer;

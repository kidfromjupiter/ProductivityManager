import { createSlice } from "@reduxjs/toolkit";
import { store } from "./store";

export const TrackerSlice = createSlice({
	name: "tracker",
	initialState: {
		trackingData: [],
		trackerObjectList: {},
		sessionTimeTot: 0,
		breakTimeTot: 0,
		timeSpentOnApp: 0,
		timeSpentPaused: 0,
		screenTime: { Home: 0, Reminders: 0, SpacedRep: 0, Timer: 0, Settings: 0 },
		dateModified: null,
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
		_SET_sessionTimeTot: (state, actions) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.sessionTimeTot = actions.payload.time;
			return localState;
		},
		_SET_breakTimeTot: (state, actions) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.breakTimeTot = actions.payload.time;
			return localState;
		},
		_SET_timeSpentOnApp: (state, actions) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.timeSpentOnApp = actions.payload.time;
			return localState;
		},
		_SET_timeSpentPaused: (state, actions) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.timeSpentPaused = actions.payload.time;
			return localState;
		},
		_SET_screentime: (state, actions) => {
			let localState = JSON.parse(JSON.stringify(state));
			const { Home, Reminders, SpacedRep, Timer, Settings } = actions.payload;
			localState.screenTime = {
				Home: Home,
				Reminders: Reminders,
				SpacedRep: SpacedRep,
				Timer: Timer,
				Settings: Settings,
			};
			return localState;
		},
		_SET_dateModified: (state, actions) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.dateModified = actions.payload.date;
			return localState;
		},
		setNewDay: (state) => {
			const {
				sessionTimeTot,
				breakTimeTot,
				timeSpentOnApp,
				timeSpentPaused,
				screenTime,
				dateModified,
				trackingData,
			} = state;
			// let localState = JSON.parse(JSON.stringify(state));
			const data = {
				sessionTimeTot: sessionTimeTot,
				breakTimeTot: breakTimeTot,
				timeSpentPaused: timeSpentPaused,
				timeSpentOnApp: timeSpentOnApp,
				screenTime: screenTime,
				trackingData: trackingData,
			};

			const today = new Date().toISOString().substring(0, 10);
			// state.trackerObjectList[dateModified] = data;
			state.trackerObjectList ? null : (state.trackerObjectList = {});
			state.trackerObjectList = Object.assign(state.trackerObjectList, {
				[dateModified]: data,
			});
			state.dateModified = today;
			state.breakTimeTot = 0;
			state.timeSpentOnApp = 0;
			state.sessionTimeTot = 0;
			state.timeSpentPaused = 0;
			state.screenTime = {
				Home: 0,
				Reminders: 0,
				SpacedRep: 0,
				Timer: 0,
				Settings: 0,
			};
			state.trackingData = [];
		},
		resetTracker: (state) => {
			const today = new Date().toISOString().substring(0, 10);
			// state.trackerObjectList[dateModified] = data;
			state.trackingData = [];
			state.trackerObjectList = {};
			state.dateModified = today;
			state.breakTimeTot = 0;
			state.timeSpentOnApp = 0;
			state.sessionTimeTot = 0;
			state.timeSpentPaused = 0;
			state.screenTime = {
				Home: 0,
				Reminders: 0,
				SpacedRep: 0,
				Timer: 0,
				Settings: 0,
			};
		},
	},
});

export const {
	logData,
	reset,
	_SET_sessionTimeTot,
	_SET_breakTimeTot,
	_SET_timeSpentOnApp,
	_SET_timeSpentPaused,
	_SET_screentime,
	_SET_dateModified,
	setNewDay,
	resetTracker,
} = TrackerSlice.actions;
export default TrackerSlice.reducer;

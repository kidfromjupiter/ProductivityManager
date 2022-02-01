import { createSlice } from "@reduxjs/toolkit";
import { ActivityIndicatorComponent } from "react-native";

export const PomodoroSlice = createSlice({
	name: "pomodoro",
	initialState: {
		timerRunning: false,
		timerStarted: false,
		sessionData: [],
	},
	reducers: {
		setSessionData: (state, action) => {
			state.sessionData.unshift(action.payload);
		},
		setTimerRunning: (state, action) => {
			console.log("timer running");
		},
		setTimerStarted: (state, action) => {
			state.timerStarted = action.payload;
		},
		setSessionTime: (state, action) => {
			let stateCopy = JSON.parse(JSON.stringify(state));

			stateCopy.sessionData[action.payload.index].sessionTime =
				action.payload.time;
			return stateCopy;
		},
		setBreakTime: (state, action) => {
			let stateCopy = JSON.parse(JSON.stringify(state));
			stateCopy.sessionData[action.payload.index].breakTime =
				action.payload.time;
			return stateCopy;
		},
		setNumOfSessions: (state, action) => {
			let stateCopy = JSON.parse(JSON.stringify(state));
			stateCopy.sessionData[action.payload.index].numOfSessions =
				action.payload.number;
			return stateCopy;
		},
		deletePreset: (state, action) => {
			let stateCopy = JSON.parse(JSON.stringify(state));
			stateCopy.sessionData.splice(action.payload.index, 1);
			// stateCopy.sessionData = { ...newList };
			return stateCopy;
		},
		setTitle: (state, action) => {
			let stateCopy = JSON.parse(JSON.stringify(state));
			stateCopy.sessionData[action.payload.index].title = action.payload.title;
			return stateCopy;
		},
	},
});
export const {
	setSessionData,
	setTimerRunning,
	setTimerStarted,
	setBreakTime,
	setSessionTime,
	setNumOfSessions,
	deletePreset,
	setTitle,
} = PomodoroSlice.actions;
export default PomodoroSlice.reducer;

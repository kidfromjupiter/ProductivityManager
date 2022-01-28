import { createSlice } from "@reduxjs/toolkit";

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
	},
});
export const { setSessionData, setTimerRunning, setTimerStarted } =
	PomodoroSlice.actions;
export default PomodoroSlice.reducer;

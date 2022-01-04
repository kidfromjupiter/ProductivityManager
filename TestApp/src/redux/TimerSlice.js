import { createSlice } from "@reduxjs/toolkit";

export const TimerSlice = createSlice({
	name: "timer",
	initialState: {
		time: 0,
		isRunning: false,
		isPaused: false,
		isReset: false,
		isStopped: false,
		isStarted: false,
		isFinished: false,
	},
	reducers: {
		startTimer: (state) => {
			if (state.isRunning) {
				state.isRunning = false;
				state.isFinished = false;
			} else {
				state.isRunning = true;
				state.isStarted = true;
				state.isFinished = false;
			}
		},
		setTimer: (state, action) => {
			if (action.payload.time == 0) {
				state.isRunning = false;
				state.isFinished = true;
			}
			state.time = action.payload.time;
		},
		resetTimer: (state) => {
			state.time = 0;
			console.log("timerReset to zero");
		},
	},
});

export const { startTimer } = TimerSlice.actions;
export const { timerFinished } = TimerSlice.actions;
export const { setTimer } = TimerSlice.actions;
export const { resetTimer } = TimerSlice.actions;
export default TimerSlice.reducer;

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
			} else {
				state.isRunning = true;
				state.isStarted = true;
			}
		},
		setTimer: (state, action) => {
			state.time = action.payload.time;
		},
		resetTimer: (state) => {
			state.isReset = true;
			state.time = 0;
		},
	},
});

export const { startTimer } = TimerSlice.actions;
export const { setTimer } = TimerSlice.actions;
export const { resetTimer } = TimerSlice.actions;
export default TimerSlice.reducer;

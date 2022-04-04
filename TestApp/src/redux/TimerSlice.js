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
		initialValue: 0,
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
			state.isRunning = false;
			state.isFinished = false;
		},
		setInitialValue: (state, action) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.initialValue = action.payload.initialValue;
			return localState;
		},
	},
});

export const {
	startTimer,
	timerFinished,
	setTimer,
	resetTimer,
	setInitialValue,
} = TimerSlice.actions;
export default TimerSlice.reducer;

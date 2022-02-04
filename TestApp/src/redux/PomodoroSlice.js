import { createSlice } from "@reduxjs/toolkit";

export const PomodoroSlice = createSlice({
	name: "pomodoro",
	initialState: {
		time: 0,
		isRunning: false,
		isPaused: false,
		isSession: true,
		isFinished: false,
		numOfPresets: 0,
		cycleData: [],
	},
	reducers: {
		setTime: (state, action) => {
			let localState = JSON.parse(JSON.stringify(state));
			if (action.payload.time == 0) {
				localState.isSession = !localState.isSession;
			}
			localState.time = action.payload.time;
			return localState;
		},
		resetTimer: (state) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.time = 0;
			localState.isRunning = false;
			localState.isSession = true;
			localState.cycleData = [];
			return localState;
		},
		toggleTimer: (state) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.isRunning = !localState.isRunning;
			localState.isPaused = !localState.isPaused;
			return localState;
		},
		incrementNumOfPresets: (state, action) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.numOfPresets = localState.numOfPresets + action.payload.number;
			console.log("ran incrementNumOfPresets");
			return localState;
		},
		setCycleData: (state, action) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.cycleData = action.payload.array;
			localState.isFinished = false;
			console.log("ran setCycleData slice");
			const time = localState.cycleData.shift();
			localState.time = time * 60;
			return localState;
		},
		setNewCycle: (state) => {
			let localState = JSON.parse(JSON.stringify(state));
			const time = localState.cycleData.shift();
			// console.log(time)
			if (localState.cycleData.length == 0) {
				localState.isFinished = true;
			}
			localState.isRunning = false;
			localState.isSession = !localState.isSession;
			localState.time = time * 60;
			console.log(localState);
			return localState;
		},
		exitCleanup: (state) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.cycleData = [];
			localState.isRunning = false;
			localState.isPaused = false;
			localState.time = 0;
			localState.isSession = true;
			localState.numOfPresets = 0;
			localState.isFinished = false;
			return localState;
		},
	},
});
export const {
	setTime,
	resetTimer,
	toggleTimer,
	incrementNumOfPresets,
	setNewCycle,
	setCycleData,
	exitCleanup,
} = PomodoroSlice.actions;
export default PomodoroSlice.reducer;

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
		pomodoroName: "",
		pomodoroID: null,
		numOfTotalSessions: 0,
		// activeCycleIndex: 0,
	},
	reducers: {
		setTime: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			if (action.payload.time == 0) {
				localState.isSession = !localState.isSession;
			}
			localState.time = action.payload.time;
			return localState;
		},
		resetTimer: (state) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.time = 0;
			localState.isRunning = false;
			localState.isSession = true;
			localState.cycleData = [];
			return localState;
		},
		toggleTimer: (state) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.isRunning = !localState.isRunning;
			localState.isPaused = !localState.isPaused;
			return localState;
		},
		incrementNumOfPresets: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.numOfPresets = localState.numOfPresets + action.payload.number;
			return localState;
		},
		setCycleData: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.cycleData = action.payload.array;
			localState.pomodoroName = action.payload.name;
			localState.pomodoroID = action.payload.id;
			localState.isFinished = false;
			localState.numOfTotalSessions = localState.cycleData.length;
			const time = localState.cycleData.shift();
			localState.time = time * 60;
			return localState;
		},
		setNewCycle: (state) => {
			const localState = JSON.parse(JSON.stringify(state));
			let time = 0;
			if (localState.cycleData.length > 0) {
				time = localState.cycleData.shift();
			}
			// console.log(time)
			if (localState.cycleData.length == 0) {
				localState.isFinished = true;
			}
			localState.isRunning = false;
			localState.isSession = !localState.isSession;
			localState.time = time * 60;
			return localState;
		},
		exitCleanup: (state) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.cycleData = [];
			localState.isRunning = false;
			localState.isPaused = false;
			localState.time = 0;
			localState.isSession = true;
			localState.numOfPresets = 0;
			localState.isFinished = false;
			// localState.activeCycleIndex = 0;
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

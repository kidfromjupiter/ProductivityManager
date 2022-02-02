import { createSlice } from "@reduxjs/toolkit";

export const PomodoroSlice = createSlice({
	name: "pomodoro",
	initialState: {
		time: 0,
		isRunning: false,
		isPaused: false,
		isReset: false,
		isStopped: false,
		isStarted: false,
		isFinished: false,
		sessionData: [],
		currentSessionArray: [],
	},
	reducers: {
		setSessionData: (state, action) => {
			state.sessionData.unshift(action.payload);
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
		toggleTimer: (state) => {
			state.isRunning = !state.isRunning;
			state.isPaused = !state.isPaused;
			state.isFinished = false;
		},
		setTimer: (state, action) => {
			if (action.payload.time == 0) {
				// state.isRunning = false;
				state.isFinished = true;
				state.isSession = action.payload.session;
			}
			state.time = action.payload.time;
		},
		resetTimer: (state) => {
			state.time = 0;
			state.isRunning = false;
		},
		setCurrentSessionArray: (state, action) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.currentSessionArray = action.payload.array;
			return localState;
		},
		decrementCurrentSessionArrayAndStart: (state) => {
			let localState = JSON.parse(JSON.stringify(state));
			const newArray = localState.currentSessionArray.slice(
				1,
				localState.currentSessionArray.length
			);
			localState.currentSessionArray = newArray;
			localState.isRunning = !localState.isRunning;
			localState.isPaused = !localState.isPaused;
			localState.isFinished = false;
			return localState;
		},
	},
});
export const {} = PomodoroSlice.actions;
export default PomodoroSlice.reducer;

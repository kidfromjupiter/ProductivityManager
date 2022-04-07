import { createSlice } from "@reduxjs/toolkit";

export const RemiderSlice = createSlice({
	name: "reminders",
	initialState: {
		reminders: [],
		completed: [],
	},
	reducers: {
		addReminder: (state, action) => {
			state.reminders.unshift(action.payload);
		},
		editReminder: (state, action) => {
			// gets the current state of the object using index from payload. splices and removes the object. switches the state. adds it again at the end of the reminders list
			const localState = JSON.parse(JSON.stringify(state));
			const completedState =
				localState.reminders[action.payload.index].completed;
			if (completedState == false) {
				const RemovedReminder = localState.reminders.splice(
					action.payload.index,
					1
				);
				RemovedReminder[0].completed = !completedState;
				localState.completed.push(RemovedReminder[0]);
			} else {
				localState.reminders[action.payload.index].completed = !completedState;
				const toggledReminder = localState.reminders.splice(
					action.payload.index,
					1
				);
				localState.reminders.unshift(toggledReminder[0]);
			}
			return localState;
		},
		deleteReminder: (state, action) => {
			state.reminders.splice(action.payload.index, 1);
		},
		batchAdd: (state, action) => {
			const localstate = JSON.parse(JSON.stringify(state));
			if (!(action.payload.completed || action.payload.reminders)) {
				localstate.reminders = [];
				localstate.completed = [];
				return localstate;
			}
			localstate.reminders = action.payload.reminders;
			localstate.completed = action.payload.completed;
			return localstate;
		},
		deleteAllReminders: (state, action) => {
			const localstate = JSON.parse(JSON.stringify(state));
			localstate.reminders = [];
			localstate.completed = [];
			return localstate;
		},
	},
});

export const {
	addReminder,
	editReminder,
	deleteReminder,
	batchAdd,
	deleteAllReminders,
} = RemiderSlice.actions;
export default RemiderSlice.reducer;

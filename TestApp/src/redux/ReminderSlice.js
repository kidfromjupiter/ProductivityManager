import { createSlice } from "@reduxjs/toolkit";

export const RemiderSlice = createSlice({
	name: "reminders",
	initialState: {
		reminders: [],
	},
	reducers: {
		addReminder: (state, action) => {
			state.reminders.unshift(action.payload);
		},
		editReminder: (state, action) => {
			//gets the current state of the object using index from payload. splices and removes the object. switches the state. adds it again at the end of the reminders list
			const completedState = state.reminders[action.payload.index].completed;
			if (completedState == false) {
				const RemovedReminder = state.reminders.splice(action.payload.index, 1);
				RemovedReminder[0].completed = !completedState;
				state.reminders.push(RemovedReminder[0]);
			} else {
				state.reminders[action.payload.index].completed = !completedState;
				state.reminders.sort(function (a, b) {
					if (a.completed > b.completed) {
						return 1;
					}
					if (a.completed < b.completed) {
						return -1;
					}
					return 0;
				});
			}
		},
		deleteReminder: (state, action) => {
			state.reminders.splice(action.payload.index, 1);
		},
	},
});

export const { addReminder, editReminder, deleteReminder } =
	RemiderSlice.actions;
export default RemiderSlice.reducer;

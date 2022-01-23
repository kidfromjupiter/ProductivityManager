import { createSlice } from "@reduxjs/toolkit";

export const RemiderSlice = createSlice({
	name: "reminders",
	initialState: {
		reminders: [],
	},
	reducers: {
		addReminder: (state, action) => {
			state.reminders.push(action.payload);
		},
		editReminder: (state, action) => {
			state.reminders[action.payload.index] = action.payload.reminder;
		},
	},
});

export const { addReminder } = RemiderSlice.actions;
export const { editReminder } = RemiderSlice.actions;
export default RemiderSlice.reducer;

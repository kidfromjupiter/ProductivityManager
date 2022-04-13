import { createSlice } from "@reduxjs/toolkit";

export const DeadlineSlice = createSlice({
	name: "deadline",
	initialState: {
		deadline: 0,
	},
	reducers: {
		setDeadline: (state, action) => {
			let localState = JSON.parse(JSON.stringify(state));

			localState.deadline = action.payload.deadline;
			return localState;
		},
		clearDeadline: (state, action) => {
			let localState = JSON.parse(JSON.stringify(state));

			localState.deadline = 0;
			return localState;
		},
	},
});

export const { setDeadline, clearDeadline } = DeadlineSlice.actions;
export default DeadlineSlice.reducer;

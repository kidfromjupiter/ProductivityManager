import { createSlice } from "@reduxjs/toolkit";

export const CalSlice = createSlice({
	name: "calendar",
	initialState: {
		events: null,
	},
	reducers: {
		setEvents: (state, actions) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.events = {};
			localState.events[actions.payload.id] = actions.payload.spacedRep;
			return localState;
		},
	},
});

export const { setEvents } = CalSlice.actions;
export default CalSlice.reducer;

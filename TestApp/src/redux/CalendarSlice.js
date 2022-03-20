import { createSlice } from '@reduxjs/toolkit';

export const CalSlice = createSlice({
	name: 'calendar',
	initialState: {
		events: null,
	},
	reducers: {
		setEvents: (state, actions) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.events = actions.payload.spacedRepEvents;
			return localState;
		},
	},
});

export const { setCalendarID, setEvents } = CalSlice.actions;
export default CalSlice.reducer;

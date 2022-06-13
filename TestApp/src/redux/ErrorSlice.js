import { createSlice } from "@reduxjs/toolkit";

export const ErrorSlice = createSlice({
	name: "error",
	initialState: {
		error: null,
		display: false,
	},
	reducers: {
		_SET_error: (state, actions) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.error = actions.payload;
			localState.display = true;
			return localState;
		},
		_REMOVE_error: (state, actions) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.error = null;
			localState.display = false;
			return localState;
		},
	},
});

export const { _SET_error, _REMOVE_error } = ErrorSlice.actions;
export default ErrorSlice.reducer;

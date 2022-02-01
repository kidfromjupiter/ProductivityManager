import { createSlice } from "@reduxjs/toolkit";

export const ColorSlice = createSlice({
	name: "colors",
	initialState: {
		backgroundColor: "#191F2C",
		levelOne: "#2B3748",
		levelTwo: "#445168",
		levelThree: "#586781",
		levelFour: "#97A7C2",
		textColor: "#D7D7D7",
		textColorTwo: "#BECADE",
		accentColor: "#00D34B",
	},
	reducers: {
		changeBackgroundColor: (state, action) => {
			state.backgroundColor = action.payload;
		},
		changeAccentColor: (state, action) => {
			state.accentColor = action.payload;
		},
		changeLevelOneColor: (state, action) => {
			state.levelOne = action.payload;
		},
		changeLevelTwoColor: (state, action) => {
			state.levelTwo = action.payload;
		},
		changeTextColor: (state, action) => {
			state.textColor = action.payload;
		},
	},
});

export const {
	changeBackgroundColor,
	changeTextColor,
	changeAccentColor,
	changeLevelOneColor,
	changeLevelTwoColor,
} = ColorSlice.actions;
export default ColorSlice.reducer;

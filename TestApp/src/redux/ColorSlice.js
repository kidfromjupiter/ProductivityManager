import { createSlice } from "@reduxjs/toolkit";

export const ColorSlice = createSlice({
	name: "colors",
	initialState: {
		backgroundColor: "#191F2C",
		levelOne: "#2B3748",
		levelTwo: "#445168",
		levelThree: "#586781",
		levelFour: "#97A7C2",
		textColorLight: "#D7D7D7", // light
		textColorDark: "#BECADE", // dark
		accentColor: "#00D34B",
		statusbarTheme: "light",
		name: "Slate moss",
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
			state.textColorLight = action.payload;
		},
		changeColorScheme: (state, action) => {
			const localState = JSON.parse(JSON.stringify(state));
			localState.backgroundColor = action.payload.backgroundColor;
			localState.levelOne = action.payload.levelOne;
			localState.levelTwo = action.payload.levelTwo;
			localState.levelThree = action.payload.levelThree;
			localState.levelFour = action.payload.levelFour;
			localState.textColorLight = action.payload.textColorLight;
			localState.textColorDark = action.payload.textColorDark;
			localState.accentColor = action.payload.accentColor;
			localState.name = action.payload.name;
			localState.statusbarTheme = action.payload.statusbarTheme;
			return localState;
		},
	},
});

export const {
	changeBackgroundColor,
	changeTextColor,
	changeAccentColor,
	changeLevelOneColor,
	changeLevelTwoColor,
	changeColorScheme,
} = ColorSlice.actions;
export default ColorSlice.reducer;

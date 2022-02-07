import { createSlice } from "@reduxjs/toolkit";

export const ColorSlice = createSlice({
	name: "colors",
	initialState: {
		//slate moss
		// backgroundColor: "#191F2C",
		// levelOne: "#2B3748",
		// levelTwo: "#445168",
		// levelThree: "#586781",
		// levelFour: "#97A7C2",
		// textColor: "#D7D7D7", //light
		// textColorTwo: "#BECADE", //dark
		// accentColor: "#00D34B",
		//////////////////////////
		// rose gold
		// backgroundColor: "#A86452",
		// levelOne: "#CDA398",
		// levelTwo: "#FDC3B8",
		// levelThree: "#EFCAC3",
		// levelFour: "#FBCEC5",
		// textColor: "#E7D0D4",
		// textColorTwo: "#454545",
		// accentColor: "#7D4348",
		///////////////////////////
		//Pineapple under the sea
		// backgroundColor: "#00468B",
		// levelOne: "#118FC8",
		// levelTwo: "#2ECAE9",
		// levelThree: "#8EECFE",
		// levelFour: "#A6EBF8",
		// textColor: "#D9F8FF",
		// textColorTwo: "#454545",
		// accentColor: "#FFE35B",
		/////////////////////////////
		//very black
		// backgroundColor: "#000000",
		// levelOne: "#292A2A",
		// levelTwo: "#494949",
		// levelThree: "#656565",
		// levelFour: "#767676",
		// textColor: "#D9D9D9",
		// textColorTwo: "#000000",
		// accentColor: "#C6C6C6",
		////////////////////////////////

		// sea green
		// backgroundColor: "#130050",
		// levelOne: "#152068",
		// levelTwo: "#25497F",
		// levelThree: "#367997",
		// levelFour: "#4EADAF",
		// textColor: "#B3CFF7",
		// textColorTwo: "#001423",
		// accentColor: "#38D9DD",

		/////////////////////////////////
		// sunset forest
		backgroundColor: "#30301B",
		levelOne: "#2F4F31",
		levelTwo: "#698366",
		levelThree: "#D6B16F",
		levelFour: "#E2822C",
		textColor: "#FFD8C5",
		textColorTwo: "#311600",
		accentColor: "#DB5B1E",
		name: "Sunset Forest",
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
		changeColorScheme: (state, action) => {
			let localState = JSON.parse(JSON.stringify(state));
			localState.backgroundColor = action.payload.backgroundColor;
			localState.levelOne = action.payload.levelOne;
			localState.levelTwo = action.payload.levelTwo;
			localState.levelThree = action.payload.levelThree;
			localState.levelFour = action.payload.levelFour;
			localState.textColor = action.payload.textColor;
			localState.textColorTwo = action.payload.textColorTwo;
			localState.accentColor = action.payload.accentColor;
			localState.name = action.payload.name;
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

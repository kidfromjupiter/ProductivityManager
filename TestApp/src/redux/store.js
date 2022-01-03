import { configureStore } from "@reduxjs/toolkit";
import TimerSliceReducer from "./TimerSlice";

export default configureStore({
	reducer: {
		time: TimerSliceReducer,
	},
});

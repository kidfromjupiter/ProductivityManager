import { configureStore } from "@reduxjs/toolkit";
import TimerSliceReducer from "./TimerSlice";
import ReminderSliceReducer from "./ReminderSlice";
import ColorSlice from "./ColorSlice";

export default configureStore({
	reducer: {
		time: TimerSliceReducer,
		reminders: ReminderSliceReducer,
		colors: ColorSlice,
	},
});

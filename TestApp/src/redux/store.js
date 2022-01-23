import { configureStore } from "@reduxjs/toolkit";
import TimerSliceReducer from "./TimerSlice";
import ReminderSliceReducer from "./ReminderSlice";

export default configureStore({
	reducer: {
		time: TimerSliceReducer,
		reminders: ReminderSliceReducer,
	},
});

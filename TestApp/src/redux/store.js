import { configureStore } from "@reduxjs/toolkit";
import TimerSliceReducer from "./TimerSlice";
import ReminderSliceReducer from "./ReminderSlice";
import ColorSlice from "./ColorSlice";
import PomodoroSlice from "./PomodoroSlice";

export default configureStore({
	reducer: {
		time: TimerSliceReducer,
		reminders: ReminderSliceReducer,
		colors: ColorSlice,
		pomodoro: PomodoroSlice,
	},
});

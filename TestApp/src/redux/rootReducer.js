import { combineReducers } from "@reduxjs/toolkit";
import TimerSlice from "./TimerSlice";
import ReminderSlice from "./ReminderSlice";
import PomodoroSlice from "./PomodoroSlice";
import ColorSlice from "./ColorSlice";

const rootReducer = combineReducers({
	time: TimerSlice,
	reminders: ReminderSlice,
	colors: ColorSlice,
	pomodoro: PomodoroSlice,
});

export default rootReducer;

import { combineReducers } from "@reduxjs/toolkit";
// import AnalyticsSlice from "./AnalyticsSlice";
import CalendarSlice from "./CalendarSlice";
import ColorSlice from "./ColorSlice";
import DeadlineSlice from "./DeadlineSlice";
import GAuth from "./GAuthSlice";
import PomodoroSlice from "./PomodoroSlice";
import ReminderSlice from "./ReminderSlice";
import TimerSlice from "./TimerSlice";
import TrackerSlice from "./TrackerSlice";

const rootReducer = combineReducers({
	time: TimerSlice,
	reminders: ReminderSlice,
	colors: ColorSlice,
	pomodoro: PomodoroSlice,
	gauth: GAuth,
	calendar: CalendarSlice,
	tracker: TrackerSlice,
	deadline: DeadlineSlice,
	// analytics:AnalyticsSlice
});

export default rootReducer;

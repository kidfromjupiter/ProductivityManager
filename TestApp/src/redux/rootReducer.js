import { combineReducers } from '@reduxjs/toolkit';
import TimerSlice from './TimerSlice';
import ReminderSlice from './ReminderSlice';
import PomodoroSlice from './PomodoroSlice';
import ColorSlice from './ColorSlice';
import GAuth from './GAuthSlice';
import CalendarSlice from './CalendarSlice';

const rootReducer = combineReducers({
	time: TimerSlice,
	reminders: ReminderSlice,
	colors: ColorSlice,
	pomodoro: PomodoroSlice,
	gauth: GAuth,
	calendar: CalendarSlice,
});

export default rootReducer;

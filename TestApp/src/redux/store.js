import AsyncStorage from "@react-native-async-storage/async-storage";
import { applyMiddleware } from "@reduxjs/toolkit";
import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { STATUS_CODES } from "../extras/TrackerObject";
import {
	logData,
	reset,
	_SET_dateModified,
	setNewDay,
} from "../redux/TrackerSlice";
import rootReducer from "./rootReducer";
import { Tracker } from "../extras/TrackerObject";
import { tracker_newday_cleanup } from "./PomodoroSlice";

const persistConfig = {
	key: "root",
	storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

function addToTracker(data) {
	store.dispatch(logData(new Tracker(data)));
	// reset()
	// store.dispatch(reset());
}

function newDayCleanup_pomodoro() {
	store.dispatch(tracker_newday_cleanup());
}

const logger = (store) => (next) => (action) => {
	// console.log(action.type);
	if (action.type === "pomodoro/setCycleData") {
		addToTracker({
			name: action.payload.name,
			type: STATUS_CODES.POMODORO_STARTED,
			id: action.payload.id,
		});
	}
	if (
		action.type == "tracker/setNewDay" ||
		action.type == "tracker/resetTracker"
	) {
		newDayCleanup_pomodoro();
	}
	if (action.type === "pomodoro/setNewCycle") {
		const state = store.getState();
		switch (state.pomodoro.cycleData.length % 2) {
			case 0:
				addToTracker({
					type: STATUS_CODES.BREAK_ACTIVE,
					id: state.pomodoro.pomodoroID,
				});
				break;

			default:
				addToTracker({
					type: STATUS_CODES.SESSION_ACTIVE,
					id: state.pomodoro.pomodoroID,
					// sessionNumber: state.pomodoro.cycleData.length,
				});
				break;
		}
	}
	// if (action.type.includes("tracker")) {
	// 	const today = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;
	// 	const state = store.getState().tracker;
	// 	if (!state.dateModified) {
	// 		store.dispatch(_SET_dateModified({ date: today }));
	// 	} else if (state.dateModified !== today) {
	// 		store.dispatch(setNewDay());
	// 	}
	// }
	// console.log( action.type);
	return next(action);
};
const store = createStore(persistedReducer, applyMiddleware(logger));
const persistor = persistStore(store);

export { store, persistor };

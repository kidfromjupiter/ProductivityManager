import AsyncStorage from "@react-native-async-storage/async-storage";
import { applyMiddleware } from "@reduxjs/toolkit";
import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { STATUS_CODES } from "../extras/TrackerObject";
import { logData, reset } from "../redux/TrackerSlice";
import rootReducer from "./rootReducer";
import { Tracker } from "../extras/TrackerObject";

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

const logger = (store) => (next) => (action) => {
	if (action.type === "pomodoro/setCycleData") {
		console.log("this is the payload id", action.payload.id);
		addToTracker({
			name: action.payload.name,
			type: STATUS_CODES.POMODORO_STARTED,
			id: action.payload.id,
		});
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
	return next(action);
};
const store = createStore(persistedReducer, applyMiddleware(logger));
const persistor = persistStore(store);

export { store, persistor };

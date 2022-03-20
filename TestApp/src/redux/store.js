// import { configureStore } from "@reduxjs/toolkit";
// import TimerSliceReducer from "./TimerSlice";
// import ReminderSliceReducer from "./ReminderSlice";
// import ColorSlice from "./ColorSlice";
// import PomodoroSlice from "./PomodoroSlice";
import rootReducer from './rootReducer';

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };

// export default configureStore({
// 	reducer: {
// 		time: TimerSliceReducer,
// 		reminders: ReminderSliceReducer,
// 		colors: ColorSlice,
// 		pomodoro: PomodoroSlice,
// 	},
// });

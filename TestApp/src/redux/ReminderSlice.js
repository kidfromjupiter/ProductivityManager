import { createSlice } from "@reduxjs/toolkit";

export const RemiderSlice = createSlice({
	name: "reminders",
	initialState: {
		reminders: {},
		completed: {},
		editmode: false,
	},
	reducers: {
		addReminder: (state, action) => {
			const localstate = JSON.parse(JSON.stringify(state));
			let reminderObject = localstate.reminders;
			reminderObject[action.payload.category].reminders.unshift(
				action.payload.reminder
			);
			return localstate;
		},
		editReminder: (state, action) => {
			// gets the current state of the object using index from payload. splices and removes the object. switches the state. adds it again at the end of the reminders list
			const localState = JSON.parse(JSON.stringify(state));
			const completedState =
				localState.reminders[action.payload.index].completed;
			if (completedState == false) {
				const RemovedReminder = localState.reminders.splice(
					action.payload.index,
					1
				);
				RemovedReminder[0].completed = !completedState;
				localState.completed.push(RemovedReminder[0]);
			} else {
				localState.reminders[action.payload.index].completed = !completedState;
				const toggledReminder = localState.reminders.splice(
					action.payload.index,
					1
				);
				localState.reminders.unshift(toggledReminder[0]);
			}
			return localState;
		},
		deleteReminder: (state, action) => {
			const localstate = JSON.parse(JSON.stringify(state));
			const type = action.payload.type;
			const index = action.payload.index;
			const category = action.payload.category;
			if (type == "completed") {
				console.log("ran this ");
				localstate.completed[category].reminders.splice(index, 1);
			} else {
				localstate.reminders[category].reminders.splice(index, 1);
			}
			localstate.completed[category].reminders.map((e) => console.log(e));
			return localstate;
		},
		batchAdd: (state, action) => {
			const localstate = JSON.parse(JSON.stringify(state));
			if (!(action.payload.completed || action.payload.reminders)) {
				localstate.reminders = {};
				localstate.completed = {};
				return localstate;
			}
			localstate.reminders = action.payload.reminders;
			localstate.completed = action.payload.completed;
			return localstate;
		},
		deleteAllReminders: (state, action) => {
			const localstate = JSON.parse(JSON.stringify(state));
			localstate.reminders = {};
			localstate.completed = {};
			return localstate;
		},
		setCompleted: (state, action) => {
			const localstate = JSON.parse(JSON.stringify(state));
			const index = action.payload.index;
			const category = action.payload.category;
			let ongoingReminders = [...localstate.reminders[category].reminders];
			let completedReminders = [...localstate.completed[category].reminders];
			const completedState = ongoingReminders[index].completed;

			const selectedReminder = ongoingReminders.splice(index, 1);
			selectedReminder[0].completed = !completedState;

			const completedReminder = [...completedReminders, selectedReminder[0]];
			localstate.reminders[category].reminders = ongoingReminders;
			localstate.completed[category].reminders = completedReminder;
			return localstate;
		},
		setOngoing: (state, action) => {
			const localstate = JSON.parse(JSON.stringify(state));
			const index = action.payload.index;
			const category = action.payload.category;
			if (localstate.reminders[category]) {
				let ongoingReminders = [...localstate.reminders[category].reminders];
				let completedReminders = [...localstate.completed[category].reminders];
				const completedState = completedReminders[index].completed;

				const selectedReminder = completedReminders.splice(index, 1);
				selectedReminder[0].completed = !completedState;

				const ongoingReminder = [...ongoingReminders, selectedReminder[0]];
				localstate.reminders[category].reminders = ongoingReminder;
				localstate.completed[category].reminders = completedReminders;
				return localstate;
			}
			return localstate;
		},
		addCategory: (state, action) => {
			const localstate = JSON.parse(JSON.stringify(state));
			const category = action.payload.categoryName;
			localstate.reminders[category.replaceAll(" ", "_")] = {
				name: category,
				reminders: [],
				id: Math.random(),
			};
			localstate.completed[category.replaceAll(" ", "_")] = {
				name: category,
				reminders: [],
				id: Math.random(),
			};
			return localstate;
		},
		deleteReminderCategory: (state, action) => {
			const localstate = JSON.parse(JSON.stringify(state));
			const category = action.payload.category;
			delete localstate.reminders[category];
			delete localstate.completed[category];
			return localstate;
		},
		setEditMode: (state, action) => {
			const localstate = JSON.parse(JSON.stringify(state));
			localstate.editmode = !localstate.editmode;
			return localstate;
		},
	},
});

export const {
	addReminder,
	editReminder,
	deleteReminder,
	batchAdd,
	deleteAllReminders,
	setCompleted,
	setOngoing,
	addCategory,
	deleteReminderCategory,
	setEditMode,
} = RemiderSlice.actions;
export default RemiderSlice.reducer;

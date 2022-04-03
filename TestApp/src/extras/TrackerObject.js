class Tracker {
	constructor(data) {
		this.date = new Date().getTime();
		this.data = data;
	}
}

const STATUS_CODES = {
	POMODORO_STARTED: "1",
	BREAK_ACTIVE: "2",
	SESSION_ACTIVE: "3",
	POMODORO_FINISHED: "4",
	TIMER_TOGGLE: "5",
	SCREEN_CHANGE: "6",
};

export { Tracker, STATUS_CODES };

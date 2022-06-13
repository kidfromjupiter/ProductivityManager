class Tracker {
	constructor() {
		this.date = new Date();
		this.sessions = [];
		this.breaks = [];
		this.finishedPomodoros = 0;
	}
	addSession(sessionTime) {
		this.sessions.push(sessionTime);
	}
	addBreaks(breakTime) {
		this.breaks.push(breakTime);
	}
	getTotalSessionTime() {
		let time = 0;
		this.sessions.forEach((item) => (time = time + item));
		return time;
	}
	getTotalBreakTime() {
		let time = 0;
		this.breaks.forEach((item) => (time = time + item));
		return time;
	}
	incrementFinishedPomodoros() {
		this.finishedPomodoros++;
	}
}

export { Tracker };

class PomodoroClass {
	constructor(title, numOfSessions, sessionTime, breakTime, id) {
		id ? (this.id = id) : (this.id = Date.now().toString());
		this.numOfSessions = numOfSessions;
		this.sessionTime = sessionTime;
		this.breakTime = breakTime;
		this.title = title;
		this.totalTime =
			this.numOfSessions * (this.sessionTime + this.breakTime) - this.breakTime;
	}
	stringify() {
		// console.log(JSON.stringify(this));
		return JSON.stringify(this);
	}
	objectify() {
		return JSON.parse(this.stringify());
	}
}

export { PomodoroClass };

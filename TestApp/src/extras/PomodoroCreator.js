class PomodoroClass {
	constructor(title, numOfSessions, sessionTime, breakTime) {
		this.id = Date.now();
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
}

export { PomodoroClass };

class ReminderClass {
	constructor(text, description) {
		this.id = new Date().toJSON();
		this.title = text;
		this.description = description;
		this.completed = false;
	}
	stringify() {
		// console.log(JSON.stringify(this));
		return JSON.stringify(this);
	}
	objectify() {
		return JSON.parse(this.stringify());
	}
}

export { ReminderClass };

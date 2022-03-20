class CalendarEvent {
	constructor(Date, endDate, Title, tags, id, reminders) {
		this.id = id ? id : null;
		this.start = {
			date: Date,
		};
		this.end = {
			date: endDate,
		};
		this.summary = Title;
		this.transparency = 'opaque';
		this.reminders = !reminders ?
			{
				useDefault: false,
				overrides: [{ method: 'popup', minutes: 6 * 60 }],
			  } :
			reminders;
		this.extendedProperties = {
			private: tags,
		};
	}
	stringify() {
		return JSON.stringify(this);
	}
	daysTill() {
		const now = new Date();
		const due = new Date(this.start.date);
		const utc1 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
		const utc2 = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate());

		const timeTill = Math.floor(utc2 - utc1) / 1000 / 3600 / 24;

		return timeTill;
	}
	repsLeft() {
		if (
			this.extendedProperties.private.numberOfReps &&
			this.extendedProperties.private.repNumber
		) {
			const REPS_LEFT =
				this.extendedProperties.private.numberOfReps -
				this.extendedProperties.private.repNumber;
			return REPS_LEFT;
		}
		return null;
	}
	setExtendedProperties(object) {
		const tags = this.extendedProperties.private;
		this.extendedProperties.private = Object.assign({ ...tags }, { object });
	}
}

export default CalendarEvent;

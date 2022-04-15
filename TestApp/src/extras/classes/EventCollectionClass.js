export default class EventCollection {
	constructor(eventList) {
		this.eventList = eventList.sort((a, b) => a.daysTill() - b.daysTill());
	}

	getCalendarIdList() {
		const m = this.eventList.map((e) => {
			return e.id;
		});
		return m;
	}
}

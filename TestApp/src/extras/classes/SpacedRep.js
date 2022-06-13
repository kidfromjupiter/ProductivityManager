/**
 * @param {Object[]} events - list of events
 * @param {...number} id - id of the spaced rep object
 */
class SpacedRep {
	constructor(events, id, totalReps) {
		this.events = events;
		this.numOfEvents = events.length;
		this.id = id;
		this.totalReps = totalReps;
	}
	stringify() {
		return JSON.stringify(this);
	}
}
export { SpacedRep };

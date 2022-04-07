class ReminderClass {
	constructor(text, description) {
		this.id = new Date().toJSON();
		this.title = text;
		this.description = description;
		this.completed = false;
		function generateColor(ranges) {
			if (!ranges) {
				ranges = [
					[150, 256],
					[0, 190],
					[0, 30],
				];
			}
			var g = function () {
				//select random range and remove
				var range = ranges.splice(
					Math.floor(Math.random() * ranges.length),
					1
				)[0];
				//pick a random number from within the range
				return Math.floor(Math.random() * (range[1] - range[0])) + range[0];
			};
			return "rgb(" + g() + "," + g() + "," + g() + ")";
		}

		this.color = generateColor();
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

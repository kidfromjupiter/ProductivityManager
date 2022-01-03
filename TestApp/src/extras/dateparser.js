let minutes;
let seconds;

function dateParser(time) {
	const date = new Date(0);
	date.setSeconds(time);
	const timeString = date.toISOString().substr(11, 8);
	minutes = timeString.substr(3, 2);
	seconds = timeString.substr(6, 2);
	return { minutes, seconds };
}

export default dateParser;

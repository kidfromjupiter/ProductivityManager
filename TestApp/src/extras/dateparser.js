import CalendarEvent from "./classes/EventsResourceClass";
import { SpacedRep } from "./classes/SpacedRep";

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

function spacedRepDateGen(noOfDays, repcount) {
	const ratio = Math.pow(noOfDays, 1 / (Math.round(repcount) - 1));
	const dateArray = [1];
	let i = 1;
	while (i < Math.round(repcount)) {
		const genDate = dateArray[dateArray.length - 1] * ratio;
		dateArray.push(genDate);
		i++;
	}
	const roundedDates = [];
	dateArray.forEach((element) => {
		roundedDates.push(Math.round(element));
	});
	return roundedDates;
}
function DateTimeGenerator(startingDate, dateArray, title, tags) {
	const today = new Date(startingDate);
	const spacedRepId = Date.now();
	const year = today.getFullYear();
	const month = today.getMonth();
	const DateTimeArray = [];
	const repCountArray = [];
	const markedDates = [];

	for (let index = 0; index < dateArray.length; index++) {
		repCountArray[index] = index + 1;
	}

	console.log(dateArray);

	dateArray.forEach((element, index) => {
		const newDate = new Date(year, month, today.getDate() + element);
		const endDate = new Date(year, month, today.getDate() + element);
		endDate.setDate(endDate.getDate() + 1);
		// console.log(newDate);

		const Cal = new CalendarEvent(
			newDate.toISOString().substring(0, 10),
			endDate.toISOString().substring(0, 10),
			title,
			Object.assign(
				{ ...tags },
				{
					repNumber: repCountArray[index],
					numberOfReps: dateArray.length,
					id: spacedRepId,
				}
			)
		);
		DateTimeArray[index] = Cal;
		markedDates[index] = endDate.toISOString().substring(0, 10);
	});
	console.log(DateTimeArray);
	const CalendarEventObj = new SpacedRep(
		DateTimeArray,
		spacedRepId,
		dateArray.length
	);
	return [DateTimeArray, markedDates, CalendarEventObj];
}
export { spacedRepDateGen, DateTimeGenerator };
export default dateParser;

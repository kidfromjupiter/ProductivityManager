function sessionArrayGen(sessionTime, breakTime, numOfSessions) {
	console.log(sessionTime, breakTime, numOfSessions);
	const primaryArray = [sessionTime, breakTime];
	const secondaryArray = [];
	let i = 0;
	while (i < numOfSessions) {
		for (const num of primaryArray) {
			secondaryArray.push(num);
		}
		i++;
	}
	secondaryArray.pop();
	return secondaryArray;
}

export default sessionArrayGen;

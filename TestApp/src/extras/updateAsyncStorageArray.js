import AsyncStorage from "@react-native-async-storage/async-storage";

const updateAsyncStorageArray = async (key, value) => {
	let storedValue;
	try {
		storedValue = await AsyncStorage.getItem(key);
		const JsonValue = JSON.parse(storedValue);
		let tempArray;
		if (storedValue) {
			tempArray = JsonValue;
		} else {
			tempArray = [];
		}

		tempArray.push(value);
		console.log(tempArray);
		await AsyncStorage.setItem(key, JSON.stringify(tempArray));
	} catch (e) {
		console.log(e);
	}

	console.log("Saved array");
};
// const modifyAsyncStorageArray = async

export default updateAsyncStorageArray;

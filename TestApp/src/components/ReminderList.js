import React from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ListItem from "./ListItem";

const ReminderList = ({ DATA }) => {
	return (
		<View style={styles.container}>
			<FlatList
				style={styles.list}
				data={DATA}
				renderItem={({ item, index }) => (
					<ListItem text={item} index={index} item={item} />
				)}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// justifyContent: "center",
		backgroundColor: "#000023",
		paddingTop: 50,
		// margin: 10,
		// alignItems: "center",
	},
	list: {
		flex: 1,
		alignSelf: "center",
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width,
	},
});
export default ReminderList;

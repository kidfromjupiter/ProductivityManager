import React from "react";
import {
	View,
	Text,
	FlatList,
	Platform,
	UIManager,
	StyleSheet,
	Dimensions,
} from "react-native";
import ListItem from "./ListItem";
import { AntDesign } from "@expo/vector-icons";

if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
		backgroundColor: "#000023",
		paddingTop: 50,
	},
	list: {
		flex: 3,
		alignSelf: "center",
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width,
	},
});
export default ReminderList;

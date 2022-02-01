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
import { useSelector } from "react-redux";
import { ListEmpty } from "./MiniReminderView";

if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ReminderList = ({ DATA }) => {
	const renderItem = ({ item, index }) => (
		<ListItem index={index} item={item} />
	);
	const Color = useSelector((state) => state.colors);
	return (
		<View
			style={[styles.container, { backgroundColor: Color.backgroundColor }]}
		>
			<FlatList
				style={styles.list}
				data={DATA}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				ListEmptyComponent={() => (
					<ListEmpty colors={Color} emptyText="All done! Add a new reminder." />
				)}
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

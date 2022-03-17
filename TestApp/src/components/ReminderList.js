import React from "react";
import {
	Dimensions, FlatList,
	Platform, StyleSheet, Text, UIManager, View
} from "react-native";
import { useSelector } from "react-redux";
import ListItem from "./ListItem";
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
			{DATA.length > 0 ? (
				<Text
					style={{ textAlign: "center", color: Color.textColor, padding: 6 }}
				>
					Press and hold reminder to see more detials
				</Text>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000023",
	},
	list: {
		flex: 3,
		alignSelf: "center",
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width,
	},
});
export default ReminderList;

import React, { useState } from "react";
import {
	Dimensions,
	FlatList,
	StyleSheet,
	Text,
	View,
	ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ListHeader from "./ListHeader";
import ListItem from "./ListItem";
import { ListEmpty } from "./MiniReminderView";
import SquareListItem from "./SquareListItem";

const ReminderList = ({
	DATA,
	setComplete,
	deleteItem,
	add,
	emptyPrompt,
	actionButton,
	title,
	customStyles,
}) => {
	const Color = useSelector((state) => state.colors);
	const [headerColor] = useState(generateColor());

	const renderItem = ({ item, index }) => (
		<SquareListItem
			text={item.title}
			touchEndCallBack={setComplete}
			index={index}
			desc={item.description}
			completed={item.completed}
			deleteItem={deleteItem}
		/>
	);
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

	console.log(DATA);

	return (
		<View style={[styles.container, customStyles]}>
			<ListHeader
				text={title}
				extraStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
				textStyles={{ fontSize: 25, color: headerColor }}
				iconName={actionButton ? "pluscircle" : null}
				iconColor={headerColor}
				onPressCallback={add}
			/>

			<FlatList
				contentContainerStyle={{
					flexDirection: "column",
					padding: 10,
				}}
				numColumns={3}
				style={styles.list}
				data={DATA}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				ListEmptyComponent={
					emptyPrompt ? (
						<ListEmpty
							colors={Color}
							emptyText="All done! Add a new reminder."
						/>
					) : null
				}
				ItemSeparatorComponent={() => <View style={{ height: 10 }}></View>}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: "red",
	},
	list: {
		// flex: 3,
		alignSelf: "center",
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width,
	},
});
export default ReminderList;

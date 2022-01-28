import React from "react";
import {
	StyleSheet,
	View,
	Text,
	Animated,
	LayoutAnimation,
	FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ListItemGeneric from "./ListItemGeneric";
import { editReminder } from "../redux/ReminderSlice";

const ListEmpty = ({ emptyText, colors }) => {
	return (
		<View style={styles.emptyContainer}>
			<Text
				style={[
					styles.emptyText,
					{ color: colors ? colors.textColor : "white" },
				]}
			>
				{emptyText}
			</Text>
		</View>
	);
};

const MiniReminderView = () => {
	const reminders = useSelector((state) => state.reminders);
	const colors = useSelector((state) => state.colors);
	const dispatch = useDispatch();

	const setComplete = (index) => {
		dispatch(editReminder({ index: index }));
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	};
	const renderItem = ({ item, index }) => (
		<ListItemGeneric
			Checkbox
			checkboxColor={colors.accentColor}
			text={item.title}
			checkboxTextColor={colors.textColor}
			onCheck={setComplete}
			index={index}
			isCompleted={item.completed}
		/>
	);

	return (
		<View
			style={styles.OuterContainer}
			onTouchEnd={(event) => event.stopPropagation()}
			onTouchStart={(event) => event.stopPropagation()}
		>
			<View style={[styles.innerContainer]}>
				{/* <Text>This is text</Text> */}
				<FlatList
					style={styles.listStyle}
					extraData={reminders}
					ListEmptyComponent={() => (
						<ListEmpty colors={colors} emptyText="No reminders" />
					)}
					data={reminders.reminders}
					maxToRenderPerBatch={5}
					initialNumToRender={7}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					showsVerticalScrollIndicator={false}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		textAlign: "center",
		textAlignVertical: "center",
		padding: 30,

		fontSize: 19,
	},
	OuterContainer: {
		flex: 1,
		borderRadius: 20,
		marginHorizontal: 10,
		marginBottom: 10,
		overflow: "hidden",
	},
	innerContainer: {
		flex: 1,
		backgroundColor: "#445168",
		elevation: 2,
	},
});

export { ListEmpty, MiniReminderView };

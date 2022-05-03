import React, { useState } from "react";
import {
	Dimensions,
	FlatList,
	StyleSheet,
	Text,
	View,
	ScrollView,
	LayoutAnimation,
	SectionList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteReminder,
	deleteReminderCategory,
	setCompleted,
	setOngoing,
} from "../redux/ReminderSlice";
import ListHeader from "./ListHeader";
import { ListEmpty } from "./MiniReminderView";
import SquareListItem from "./SquareListItem";
import LottieView from "lottie-react-native";
import rainbow from "../extras/colors";

const ReminderList = ({ customStyles, route }) => {
	const Color = useSelector((state) => state.colors);

	const completedReminders = useSelector((state) => state.reminders.completed);
	const onGoingReminder = useSelector((state) => state.reminders.reminders);
	const [type] = useState(selectType(route?.params?.type));
	const editMode = useSelector((state) => state.reminders.editmode);

	const dispatch = useDispatch();
	function selectType(d) {
		switch (d) {
			case "ongoing":
				return "ongoing";

			case "completed":
				return "completed";
			default:
				break;
		}
	}

	function setComplete(index, category) {
		dispatch(setCompleted({ index: index, category: category }));
	}
	function setOngoingreminders(index, category) {
		dispatch(setOngoing({ index: index, category: category }));
	}
	function deleteItemOngoing(index, category) {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		dispatch(
			deleteReminder({ type: "ongoing", index: index, category: category })
		);
	}
	function deleteItemCompleted(index, category) {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		dispatch(
			deleteReminder({ type: "completed", index: index, category: category })
		);
	}

	function deleteCategory(category) {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		dispatch(deleteReminderCategory({ category: category }));
	}

	const renderItem = ({ item, index }) => {
		return (
			<SquareListItem
				text={item.title}
				touchEndCallBack={
					type == "ongoing"
						? (index) => setComplete(index, item.category)
						: (index) => setOngoingreminders(index, item.category)
				}
				index={index}
				desc={item.description}
				completed={item.completed}
				deleteItem={
					type == "ongoing"
						? (index) => deleteItemOngoing(index, item.category)
						: (index) => deleteItemCompleted(index, item.category)
				}
				pulseColor={item.color}
			/>
		);
	};

	const renderCategories = ({ item, index }) => {
		const reminderObj =
			type == "ongoing" ? onGoingReminder[item] : completedReminders[item];
		if (reminderObj.reminders.length == 0 && type == "completed") {
			return null;
		}
		return (
			<ListItem
				route={route}
				index={index}
				reminderObj={reminderObj}
				editMode={editMode}
				renderItem={renderItem}
				item={item}
				deleteCategory={deleteCategory}
			/>
		);
	};
	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: Color.backgroundColor },
				customStyles,
			]}
		>
			<SectionList
				renderItem={renderCategories}
				sections={[
					{
						data:
							type == "ongoing"
								? Object.keys(onGoingReminder)
								: Object.keys(completedReminders),
						renderItem: renderCategories,
						keyExtractor:
							type == "ongoing"
								? (item) => onGoingReminder[item].id
								: (item) => completedReminders[item].id,
					},
				]}
			></SectionList>
		</View>
	);
};

const ListItem = ({
	route,
	item,
	index,
	reminderObj,
	editMode,
	renderItem,
	deleteCategory,
}) => {
	const [contract, setContract] = useState(false);
	const [headerColor] = useState(
		rainbow(
			Math.random() * Math.random() * 10,
			Math.random() * Math.random() * 10
		)
	);

	return (
		<FlatList
			contentContainerStyle={{
				flexDirection: "column",
				paddingHorizontal: 5,
			}}
			ListHeaderComponent={
				<ListHeader
					text={reminderObj.name}
					extraStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
					textStyles={{ fontSize: 25, color: headerColor }}
					iconName={
						route?.params?.actionButton
							? editMode
								? "minuscircle"
								: "pluscircle"
							: null
					}
					iconColor={headerColor}
					onPressCallback={() =>
						editMode ? deleteCategory(item) : route?.params?.add(item)
					}
					titleHoldCallback={() => {
						setContract(!contract);
					}}
				/>
			}
			numColumns={2}
			scrollEnabled={false}
			data={!contract ? reminderObj.reminders : []}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
			ListEmptyComponent={
				route?.params?.emptyPrompt ? (
					<ListEmpty colors={Color} emptyText="All done! Add a new reminder." />
				) : null
			}
			// ItemSeparatorComponent={() => <View style={{ height: 10 }}></View>}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
export default ReminderList;

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
import SquareListItem from "./SquareListItem";
import Animated, { Layout, ZoomIn, ZoomOut } from "react-native-reanimated";

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const ReminderList = ({ customStyles, route }) => {
	const Color = useSelector((state) => state.colors);

	const completedReminders = useSelector((state) => state.reminders.completed);
	const onGoingReminder = useSelector((state) => state.reminders.reminders);
	const [type] = useState(selectType(route?.params?.type));
	const editMode = useSelector((state) => state.reminders.editmode);

	const [contract, setContract] = useState(false);

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
		dispatch(
			deleteReminder({ type: "ongoing", index: index, category: category })
		);
	}
	function deleteItemCompleted(index, category) {
		dispatch(
			deleteReminder({ type: "completed", index: index, category: category })
		);
	}

	function deleteCategory(category) {
		dispatch(deleteReminderCategory({ category: category }));
	}

	const transformObjtoArray = (obj) => {
		const arr = Object.keys(obj).map((key) => {
			return {
				...obj[key],
				reminders: null,
				data: [{ data: obj[key].reminders }],
				section: key,
			};
		});
		return arr;
	};
	const renderItem = ({ item }) => {
		return (
			<Animated.FlatList
				data={item.data}
				scrollEnabled={false}
				keyExtractor={(item) => item.id}
				numColumns={2}
				renderItem={({ item, index }) => {
					return (
						<Animated.View
							layout={Layout.duration(400).springify()}
							key={item.id}
							entering={ZoomIn.delay(50 * index)}
							exiting={ZoomOut}
						>
							<SquareListItem
								text={item.title}
								touchEndCallBack={
									type == "ongoing"
										? (index) => {
												setComplete(index, item.category);
												LayoutAnimation.configureNext(
													LayoutAnimation.Presets.easeInEaseOut
												);
										  }
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
						</Animated.View>
					);
				}}
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
			<AnimatedSectionList
				sections={transformObjtoArray(
					type == "ongoing" ? onGoingReminder : completedReminders
				)}
				stickySectionHeadersEnabled
				renderSectionHeader={({ section: { name, section } }) => {
					return (
						<ListHeader
							text={name}
							extraStyle={{
								paddingVertical: 10,
								paddingHorizontal: 10,
								backgroundColor: Color.backgroundColor,
								borderRadius: 10,
							}}
							textStyles={{ fontSize: 25 }}
							iconName={
								route?.params?.actionButton
									? editMode
										? "minuscircle"
										: "pluscircle"
									: null
							}
							onPressCallback={() =>
								editMode ? deleteCategory(section) : route?.params?.add(section)
							}
							titleHoldCallback={() => {
								setContract(!contract);
							}}
							randomiseColor={true}
						/>
					);
				}}
				renderItem={renderItem}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
export default ReminderList;

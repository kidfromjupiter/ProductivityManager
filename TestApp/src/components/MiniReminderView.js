import React, { useState, useEffect } from "react";
import {
	FlatList,
	LayoutAnimation,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { setCompleted } from "../redux/ReminderSlice";
import ImprovedText from "./CustomReactComponent/ImprovedText";
import ListItemGeneric from "./ListItemGeneric";

const ListEmpty = ({ emptyText, colors }) => {
	return (
		<View style={styles.emptyContainer}>
			<ImprovedText
				text={emptyText}
				style={[
					styles.emptyText,
					{ color: colors ? colors.textColorLight : "white" },
				]}
				backgroundColor={colors.levelTwo}
			/>
		</View>
	);
};

const MiniReminderView = ({ navigation }) => {
	const reminders_redux = useSelector((state) => state.reminders.reminders);
	const [reminders, setReminders] = useState(() =>
		getReminders(reminders_redux)
	);
	const colors = useSelector((state) => state.colors);
	const dispatch = useDispatch();

	// console.log(Object.keys(reminders2));
	function getReminders(list) {
		let totalReminders = [];
		for (const key in list) {
			totalReminders = totalReminders.concat(list[key].reminders);
		}
		return totalReminders;
	}

	useEffect(() => {
		setReminders(getReminders(reminders_redux));
	}, [reminders_redux]);
	function setComplete(index, category) {
		dispatch(setCompleted({ index: index, category: category }));
	}

	const renderItem = ({ item, index }) => {
		return (
			<Animated.View
				entering={FadeIn}
				exiting={FadeOut}
				layout={Layout.duration(200)}
				key={item.id}
			>
				<ListItemGeneric
					Checkbox
					checkboxColor={colors.accentColor}
					text={item.title}
					checkboxTextColor={colors.textColorDark}
					onCheck={() => setComplete(index, item.category)}
					index={index}
					isCompleted={item.completed}
				/>
			</Animated.View>
		);
	};

	return (
		<View
			style={[styles.OuterContainer]}
			onTouchEnd={(event) => event.stopPropagation()}
			onTouchStart={(event) => event.stopPropagation()}
		>
			<View style={[styles.innerContainer]}>
				{/* <Text>This is text</Text> */}
				{/* <Animated.FlatList
					style={styles.listStyle}
					ListEmptyComponent={() => (
						<ListEmpty colors={colors} emptyText="No reminders" />
					)}
					data={reminders ? reminders : null}
					maxToRenderPerBatch={5}
					initialNumToRender={7}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={() => (
						<View style={{ height: 1, backgroundColor: colors.levelThree }} />
					)}
					itemLayoutAnimation={Layout.duration(100)}
				/> */}
				<ScrollView>
					{reminders.map((item, index) => {
						return renderItem({ item: item, index: index });
					})}
				</ScrollView>
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
		marginHorizontal: 5,
		marginBottom: 5,
		overflow: "hidden",
	},
	innerContainer: {
		flex: 1,
		// backgroundColor: "#445168",
		// elevation: 2,
	},
});

export { ListEmpty };
export default MiniReminderView;

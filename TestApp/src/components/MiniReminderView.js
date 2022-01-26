import React from "react";
import {
	StyleSheet,
	View,
	Text,
	Animated,
	LayoutAnimation,
	NativeModules,
	FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ListItemGeneric from "./ListItemGeneric";
import { editReminder } from "../redux/ReminderSlice";
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
	UIManager.setLayoutAnimationEnabledExperimental(true);

const MiniReminderView = () => {
	const reminders = useSelector((state) => state.reminders);
	const colors = useSelector((state) => state.colors);
	const dispatch = useDispatch();

	const setComplete = (index) => {
		dispatch(editReminder({ index: index }));
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	};

	return (
		<View
			style={styles.OuterContainer}
			onTouchEnd={(event) => event.stopPropagation()}
			onTouchStart={(event) => event.stopPropagation()}
		>
			<View style={[styles.innerContainer]}>
				{/* <Text>This is text</Text> */}
				{reminders.reminders.length > 0 ? (
					<FlatList
						style={styles.listStyle}
						extraData={reminders}
						data={reminders.reminders}
						renderItem={({ item, index }) => (
							<ListItemGeneric
								Checkbox
								checkboxColor={colors.accentColor}
								text={item.title}
								checkboxTextColor={colors.textColor}
								onCheck={setComplete}
								index={index}
								isCompleted={item.completed}
							/>
						)}
						keyExtractor={(item) => item.id}
						showsVerticalScrollIndicator={false}
					/>
				) : (
					<Text
						style={{
							textAlign: "center",
							textAlignVertical: "center",
							padding: 30,
							color: colors.textColor,
							fontSize: 19,
						}}
					>
						All completed
					</Text>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
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

export default MiniReminderView;

import React from 'react';
import {
	FlatList,
	LayoutAnimation,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { editReminder } from '../redux/ReminderSlice';
import ListItemGeneric from './ListItemGeneric';
const ListEmpty = ({ emptyText, colors }) => {
	return (
		<View style={styles.emptyContainer}>
			<Text
				style={[
					styles.emptyText,
					{ color: colors ? colors.textColor : 'white' },
				]}
			>
				{emptyText}
			</Text>
		</View>
	);
};

const MiniReminderView = ({ navigation }) => {
	const reminders = useSelector((state) => state.reminders.reminders);
	const colors = useSelector((state) => state.colors);
	const dispatch = useDispatch();

	function setComplete(index) {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
		dispatch(editReminder({ index: index }));
	}
	const renderItem = ({ item, index }) => {
		return (
			<ListItemGeneric
				Checkbox
				checkboxColor={colors.accentColor}
				text={item.title}
				checkboxTextColor={colors.textColorTwo}
				onCheck={setComplete}
				index={index}
				isCompleted={item.completed}
			/>
		);
	};

	return (
		<View
			style={[styles.OuterContainer]}
			onTouchEnd={(event) => event.stopPropagation()}
			onTouchStart={(event) => event.stopPropagation()}
		>
			<View
				style={[styles.innerContainer, { backgroundColor: colors.levelTwo }]}
			>
				{/* <Text>This is text</Text> */}
				<FlatList
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
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyText: {
		textAlign: 'center',
		textAlignVertical: 'center',
		padding: 30,

		fontSize: 19,
	},
	OuterContainer: {
		flex: 1,
		borderRadius: 20,
		marginHorizontal: 10,
		marginBottom: 10,
		overflow: 'hidden',
	},
	innerContainer: {
		flex: 1,
		backgroundColor: '#445168',
		elevation: 2,
	},
});

export { ListEmpty };
export default MiniReminderView;

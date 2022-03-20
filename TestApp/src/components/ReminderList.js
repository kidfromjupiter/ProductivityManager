import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ListItem from './ListItem';
import { ListEmpty } from './MiniReminderView';

const ReminderList = ({ DATA, setComplete, deleteItem }) => {
	const Color = useSelector((state) => state.colors);
	// const [dataList, setDataList] = useState(DATA);
	const renderItem = ({ item, index }) => (
		<ListItem
			index={index}
			item={item}
			setCompleteCallback={setComplete}
			swipeRight={deleteItem}
		/>
	);
	const dispatch = useDispatch();

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
				ItemSeparatorComponent={() => <View style={{ height: 10 }}></View>}
			/>
			{DATA.length > 0 ? (
				<Text
					style={{ textAlign: 'center', color: Color.textColor, padding: 6 }}
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
		backgroundColor: '#000023',
	},
	list: {
		flex: 3,
		alignSelf: 'center',
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
	},
});
export default ReminderList;

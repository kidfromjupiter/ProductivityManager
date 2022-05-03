import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import ImprovedText, {
	getTextColor,
} from "../../components/CustomReactComponent/ImprovedText";
import Square from "../../components/square";
import { getAllEventCollections } from "../../extras/BACKEND";
import CircularProgress from "react-native-circular-progress-indicator";
import LoadingPopup from "../../components/LoadingIndicator";
import { useFocusEffect } from "@react-navigation/native";
export default function EventCollectionScreen({ navigation }) {
	const colors = useSelector((state) => state.colors);
	const idtoken = useSelector((state) => state.gauth.IdToken);
	const accesstoken = useSelector((state) => state.gauth.AuthToken);
	const calid = useSelector((state) => state.gauth.calendarId);
	const [eventCollections, setEventCollections] = useState([]);
	const [refreshing, setRefreshing] = useState(true);

	useEffect(() => {
		getAllEventCollections(accesstoken, idtoken, calid).then((e) => {
			setRefreshing(false);
			setEventCollections(e.data.data);
		});
	}, []);

	const renderItem = ({ item }) => {
		if (item.events[0]) {
			const length = item.events.length;
			const totalReps = item.events[0].extendedProperties.private.numberOfReps;
			const repsFinished =
				item.events[0].extendedProperties.private.numberOfReps - length;
			const percentage = (repsFinished / totalReps) * 100;
			return (
				<Square
					flex={1}
					customStyles={{
						padding: 10,
						maxWidth: Dimensions.get("screen").width / 2,
					}}
				>
					<View
						style={{
							flex: 1,
							paddingVertical: 5,
							backgroundColor: colors.levelTwo,
							borderRadius: 10,
						}}
					>
						<ImprovedText
							backgroundColor={colors.levelTwo}
							text={item.summary}
							style={{ fontSize: 22, fontWeight: "bold", textAlign: "center" }}
						/>
					</View>

					<View
						style={{
							flex: 3,
							flexDirection: "row",
							justifyContent: "space-around",
							paddingVertical: 5,
						}}
					>
						<CircularProgress
							radius={55}
							value={percentage}
							valueSuffix="%"
							inActiveStrokeColor={colors.backgroundColor}
							activeStrokeColor={colors.accentColor}
						/>
					</View>
					<FlatList
						data={
							item.events[0].extendedProperties.private.tags
								? item.events[0].extendedProperties.private.tags.split(",")
								: ["No tags here"]
						}
						renderItem={({ item }) => (
							<Text
								style={{
									padding: 3,
									backgroundColor: colors.levelTwo,
									borderRadius: 4,
									color: getTextColor(colors.levelTwo),
									margin: 3,
								}}
							>
								{item}
							</Text>
						)}
						ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
						listKey={item.events[0].extendedProperties.private.id}
						keyExtractor={(item) => item}
						style={{ marginBottom: 10 }}
						horizontal
					/>
					<View
						style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
					>
						<Text
							style={{
								padding: 3,
								fontSize: 20,
								color: "black",
								backgroundColor: "white",
								borderRadius: 10,
								paddingHorizontal: 10,
							}}
						>
							{length} reps left
						</Text>
					</View>
				</Square>
			);
		}
	};

	return (
		<View
			style={[styles.container, { backgroundColor: colors.backgroundColor }]}
		>
			<FlatList
				data={
					eventCollections.map((item) => item.events) ? eventCollections : []
				}
				extraData={eventCollections}
				renderItem={renderItem}
				refreshing={refreshing}
				onRefresh={() => {
					setRefreshing(true);
					getAllEventCollections(accesstoken, idtoken, calid).then((e) => {
						setEventCollections(e.data.data);
						setRefreshing(false);
					});
				}}
				numColumns={2}
				keyExtractor={(item) => item.calendar}
				// columnWrapperStyle={{ height: 250, backgroundColor: "red" }}
			/>
			{refreshing ? <LoadingPopup /> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 25,
	},
});

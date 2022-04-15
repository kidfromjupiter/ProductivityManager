import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
	Button,
	Dimensions,
	FlatList,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { GoogleSignin } from "react-native-google-signin";
import { useDispatch, useSelector } from "react-redux";
import ListHeader from "../../components/ListHeader";
import Loading from "../../components/LottieLoading";
import SearchBar from "../../components/SearchBar";
import SpacedRepListItem from "../../components/SpacedRep/SpacedRepListItem";
import TodayInfo from "../../components/SpacedRep/TodayInfoContainer";
import CalendarEvent from "../../extras/classes/EventsResourceClass";
import { addCalendar, getEvents } from "../../extras/calendar";
import { setCalID, setIdToken, setToken } from "../../redux/GAuthSlice";
import { getCalId } from "../../extras/BACKEND";
import EventCollection from "../../extras/classes/EventCollectionClass";

const SpacedRepHome = ({ navigation }) => {
	const dispatch = useDispatch();
	const accessToken = useSelector((state) => state.gauth.AuthToken);
	const idToken = useSelector((state) => state.gauth.IdToken);
	// const calID = useSelector((state) => state.gauth.calendarID);
	const [calID, setCalID] = useState(null);
	const signedIn = useSelector((state) => state.gauth.isSignedIn);
	const [selectedData, setSelectedData] = useState(null);
	const [eventsObjectArray, setObjectArray] = useState(null);
	const [refreshing, setRefresh] = useState(false);
	const colors = useSelector((state) => state.colors);
	const calendarEvents = useSelector((state) => state.calendar.events);

	function creatingObjectArray(e) {
		const events = [];
		const spacedRepIdArray = [];
		const spacedRepEvents = [];
		e.data.items.forEach(({ start, summary, id, extendedProperties }) => {
			const d = new CalendarEvent(
				start.date,
				start.date,
				summary,
				extendedProperties.private,
				id
			);
			if (!spacedRepIdArray.includes(extendedProperties.private.id)) {
				spacedRepIdArray.push({
					id: extendedProperties.private.id,
					object: d,
				});
			}
			spacedRepIdArray.forEach((idObj) => {
				let repsRemaining = 0;
				e.data.items.forEach((obj) => {
					if (obj.extendedProperties.private.id == idObj.id) {
						repsRemaining++;
					}
				});
				idObj.object.extendedProperties.private.repsRemaining = repsRemaining;
				idObj.object.extendedProperties.private.percentFinished = Math.floor(
					((idObj.object.extendedProperties.private.numberOfReps -
						repsRemaining) /
						idObj.object.extendedProperties.private.numberOfReps) *
						100
				);
				if (!events.includes(idObj.object)) {
					events.push(idObj.object);
				}
			});
		});
		const eventcollection = new EventCollection(events);
		setObjectArray(eventcollection.eventList);
		setRefresh(false);
	}

	// console.log(calID);
	function refresh() {
		if (!calID) {
			getCalId(accessToken, idToken).then((e) => {
				setCalID(e.data.calendarId);
			});
		} else {
			getEvents(accessToken, calID).then((e) => {
				creatingObjectArray(e);
			});
		}
	}
	useEffect(() => {
		if (signedIn) {
			refresh();
		}
	}, [signedIn, accessToken, calID]);
	function updateObjectArray(index) {
		const objects = [...eventsObjectArray];
		objects.splice(index, 1);
		setObjectArray(objects);
	}
	function renderItem({ item, index }) {
		return (
			<SpacedRepListItem
				title={item.summary}
				percentFinished={item.extendedProperties.private.percentFinished}
				repsRemaining={item.extendedProperties.private.repsRemaining}
				tags={item.extendedProperties.private.tags?.split(",")}
				totalreps={item.extendedProperties.private.numberOfReps}
				spacedRepId={item.extendedProperties.private.id}
				daysTill={item.daysTill()}
				id={item.id}
				startDate={item.start.date}
				calendarId={calID}
				accessToken={accessToken}
				onPressCallback={setSelectedData}
				selectedId={selectedData ? selectedData.id : null}
				refreshCallback={refresh}
				setStateCallback={() => setSelectedData(null)}
				index={index}
				updateObjectArray={updateObjectArray}
				slideDelete
			/>
		);
	}
	// function renderItem_2({ item }) {
	// 	return (
	// 		<SpacedRepListItem
	// 			title={item.summary}
	// 			percentFinished={item.extendedProperties.private.percentFinished}
	// 			repsRemaining={item.extendedProperties.private.repsRemaining}
	// 			tags={item.extendedProperties.private.tags?.split(",")}
	// 			totalreps={item.extendedProperties.private.numberOfReps}
	// 			spacedRepId={item.extendedProperties.private.id}
	// 			id={item.id}
	// 			repsLeft
	// 		/>
	// 	);
	// }
	if (!signedIn) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: "black",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<LottieView
					source={require("../../../assets/animations/cal.json")}
					style={{ height: 250, width: 250 }}
					autoPlay
					loop
					speed={0.75}
				/>
				<Button
					title="Sign in"
					onPress={() => navigation.navigate("Settings")}
				/>
			</View>
		);
	} else if (!eventsObjectArray) {
		return <Loading />;
	} else {
		return (
			<View
				style={[styles.container, { backgroundColor: colors.backgroundColor }]}
			>
				<View style={styles.topBar}>
					<SearchBar
						placeholder="Search by tags, title"
						extraStyles={{ height: 40 }}
					/>
					<AntDesign
						name="pluscircle"
						size={35}
						color="white"
						onPress={() => navigation.navigate("CreateEvent")}
					/>
				</View>
				{/* {almostFinished ? (
					<View style={[styles.section, { maxHeight: 200 }]}>
						<ListHeader
							text="Almost Finished"
							extraStyle={{ paddingHorizontal: 5, paddingRight: 10 }}
						/>
						<FlatList
							data={almostFinished}
							refreshing={refreshing}
							initialNumToRender={2}
							onRefresh={() => {
								setRefresh(true);
								refresh();
							}}
							extraData={eventsObjectArray}
							renderItem={renderItem_2}
							style={{
								width: Dimensions.get("window").width,
							}}
							ListEmptyComponent={
								<View
									style={{ justifyContent: "center", alignItems: "center" }}
								>
									<Text
										style={{ color: "grey", textAlign: "center", padding: 20 }}
									>
										Looks empty boss. Try pulling down to refresh
									</Text>
									<LottieView
										source={require("../../../assets/animations/empty.json")}
										autoPlay
										loop={false}
										style={{
											backgroundColor: "transparent",
											height: 100,
											width: 200,
										}}
										speed={1.2}
									/>
								</View>
							}
						/>
					</View>
				) : null} */}
				<View style={[styles.section]}>
					<ListHeader
						text="Upcoming"
						extraStyle={{ paddingHorizontal: 5, paddingRight: 10 }}
					/>
					<FlatList
						data={eventsObjectArray}
						refreshing={refreshing}
						// initialNumToRender={2}
						onRefresh={() => {
							setRefresh(true);
							refresh();
						}}
						extraData={eventsObjectArray}
						renderItem={renderItem}
						style={{
							width: Dimensions.get("window").width,
						}}
						ListEmptyComponent={
							<View style={{ justifyContent: "center", alignItems: "center" }}>
								<Text
									style={{ color: "grey", textAlign: "center", padding: 20 }}
								>
									Looks empty boss. Try pulling down to refresh
								</Text>
								<LottieView
									source={require("../../../assets/animations/empty.json")}
									autoPlay
									loop={false}
									style={{
										backgroundColor: "transparent",
										height: 100,
										width: 200,
									}}
									speed={1.2}
								/>
							</View>
						}
						ItemSeparatorComponent={() => <View style={{ height: 7 }}></View>}
						keyExtractor={(item) => item.id}
					/>
				</View>
				{eventsObjectArray.length > 0 ? (
					<View style={[styles.section, styles.bottom]}>
						<TodayInfo
							percentage={10}
							daysTill={selectedData ? selectedData.daysTill : null}
							id={selectedData ? selectedData.id : null}
							tags={selectedData ? selectedData.tags : null}
							today={selectedData ? selectedData.today : null}
							title={selectedData ? selectedData.title : null}
							repNumber={selectedData ? selectedData.reps : null}
							refreshCallback={refresh}
							totalReps={selectedData ? selectedData.totalreps : null}
							percentFinished={
								selectedData ? selectedData.percentFinished : null
							}
							repsRemaining={selectedData ? selectedData.repsRemaining : null}
							setStateCallback={() => setSelectedData(null)}
						/>
					</View>
				) : null}
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingTop: 25,
	},
	topBar: {
		flex: 1,
		flexDirection: "row",
		width: Dimensions.get("window").width,
		alignItems: "center",
		justifyContent: "center",
		paddingRight: 10,
		maxHeight: 50,
	},
	section: {
		flex: 6,
		margin: 5,
		alignItems: "center",
	},
	bottom: {
		justifyContent: "flex-end",
		position: "absolute",
		height: 300,
		width: Dimensions.get("window").width,
		bottom: 0,
	},
});

export default SpacedRepHome;

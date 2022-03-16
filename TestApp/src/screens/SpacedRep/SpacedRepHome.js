import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	FlatList,
	Button,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setIdToken, setIsSignedIn, setToken } from "../../redux/GAuthSlice";
import ListHeader from "../../components/ListHeader";
import SearchBar from "../../components/SearchBar";
import SpacedRepListItem from "../../components/SpacedRep/SpacedRepListItem";
import TodayInfo from "../../components/SpacedRep/TodayInfoContainer";
import { deleteEvent, getEvents } from "../../extras/GAuth";
import { AntDesign } from "@expo/vector-icons";
import { useEffect } from "react";
import { setCalID } from "../../redux/GAuthSlice";
import CalendarEvent from "../../extras/classes/EventsResourceClass";
import LottieView from "lottie-react-native";
import { setEvents } from "../../redux/CalendarSlice";
import { addCalendar } from "../../extras/GAuth";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";
import { grabData } from "../../extras/BACKEND";
import Loading from "../../components/LottieLoading";

const SpacedRepHome = ({ navigation }) => {
	const dispatch = useDispatch();
	const accessToken = useSelector((state) => state.gauth.AuthToken);
	const IdToken = useSelector((state) => state.gauth.IdToken);
	const calID = useSelector((state) => state.gauth.calendarID);
	const spacedRepEventList = useSelector((state) => state.calendar.events);
	const signedIn = useSelector((state) => state.gauth.isSignedIn);
	const [selectedData, setSelectedData] = useState(null);
	const [eventsObjectArray, setObjectArray] = useState(null);
	const [refreshing, setRefresh] = useState(false);
	const [expanded_UPCOMING, setExpanded_UPCOMING] = useState(false);
	const colors = useSelector((state) => state.colors);

	function creatingObjectArray(e) {
		let events = [];
		let spacedRepIdArray = [];
		let spacedRepEvents = [];
		e.data.items.forEach(({ start, summary, id, extendedProperties }) => {
			let d = new CalendarEvent(
				start.date,
				start.date,
				summary,
				extendedProperties.private,
				id
			);
			if (d.daysTill() < 0) {
				deleteEvent(accessToken, d.id, calID);
			} else {
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
			}
		});
		let ID_ARRAY = [];
		spacedRepIdArray.forEach((e) => {
			if (!ID_ARRAY.includes(e.id)) {
				ID_ARRAY.push(e.id);
			}
		});

		ID_ARRAY.forEach((e) => {
			let i = events.find((v) => v.extendedProperties.private.id == e);
			spacedRepEvents.push(i);
		});
		events.sort((a, b) => a.daysTill() - b.daysTill());
		setObjectArray(events);
		dispatch(setEvents({ spacedRepEvents: spacedRepEvents }));
		setRefresh(false);
	}

	function refresh() {
		getEvents(accessToken, calID)
			.then((e) => {
				creatingObjectArray(e);
			})
			.catch((e) => {
				if (e.response.data.error.status == "UNAUTHENTICATED") {
					GoogleSignin.getTokens().then((e) => {
						dispatch(setToken({ AuthToken: e.accessToken }));
						dispatch(setIdToken({ IdToken: e.idToken }));
					});
				} else if (e.response.data.error.code == 404) {
					if (accessToken) {
						addCalendar(accessToken).then((e) => {
							dispatch(setCalID({ calendarID: e.data.id }));
						});
					}
				}
			});
	}
	useEffect(() => {
		if (signedIn) {
			refresh();
		}
	}, [signedIn, accessToken, calID]);

	function renderItem({ item }) {
		return (
			<SpacedRepListItem
				title={item.summary}
				percentFinished={item.extendedProperties.private.percentFinished}
				repsRemaining={item.extendedProperties.private.repsRemaining}
				tags={item.extendedProperties.private.tags.split(",")}
				totalreps={item.extendedProperties.private.numberOfReps}
				spacedRepId={item.extendedProperties.private.id}
				daysTill={item.daysTill()}
				id={item.id}
				calendarId={calID}
				accessToken={accessToken}
				onPressCallback={setSelectedData}
				selectedId={selectedData ? selectedData.id : null}
			/>
		);
	}
	function renderItem_2({ item }) {
		if (item.extendedProperties.private.percentFinished >= 50) {
			return (
				<SpacedRepListItem
					title={item.summary}
					percentFinished={item.extendedProperties.private.percentFinished}
					repsRemaining={item.extendedProperties.private.repsRemaining}
					tags={item.extendedProperties.private.tags.split(",")}
					totalreps={item.extendedProperties.private.numberOfReps}
					spacedRepId={item.extendedProperties.private.id}
					id={item.id}
					calendarId={calID}
					accessToken={accessToken}
					repsLeft
				/>
			);
		}
		return null;
	}
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
	} else if (!(eventsObjectArray && spacedRepEventList)) {
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
				<View style={[styles.section]}>
					<ListHeader
						text="Upcoming"
						extraStyle={{ paddingHorizontal: 5, paddingRight: 10 }}
						iconName="down"
						iconColor="white"
						onPressCallback={() => {
							setSelectedData(false);
							setExpanded_UPCOMING(!expanded_UPCOMING);
						}}
					/>
					<FlatList
						data={eventsObjectArray}
						refreshing={refreshing}
						initialNumToRender={2}
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
						keyExtractor={(item) => item.id}
					/>
				</View>
				{!expanded_UPCOMING ? (
					<View style={[styles.section]}>
						<ListHeader
							text="Almost Finished"
							extraStyle={{ paddingHorizontal: 5, paddingRight: 10 }}
						/>
						<FlatList
							data={spacedRepEventList}
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
				) : null}

				<View
					style={[
						styles.section,
						styles.bottom,
						{
							flex: selectedData ? 5 : 2,
							// width: Dimensions.get("window").width,
							// justifyContent: "unset",
						},
					]}
				>
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
						percentFinished={selectedData ? selectedData.percentFinished : null}
						repsRemaining={selectedData ? selectedData.repsRemaining : null}
						setStateCallback={() => setSelectedData(null)}
					/>
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	topBar: {
		flex: 1,
		flexDirection: "row",
		width: Dimensions.get("window").width,
		alignItems: "center",
		justifyContent: "center",
		paddingRight: 10,
		marginBottom: 10,
	},
	section: {
		flex: 6,
		margin: 5,
		alignItems: "center",
		// overflow: "hidden",
	},
	bottom: { flex: 5, justifyContent: "flex-end" },
});

export default SpacedRepHome;

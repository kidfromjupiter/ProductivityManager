import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
	Button,
	Dimensions,
	FlatList,
	LayoutAnimation,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ListHeader from "../../components/ListHeader";
import Loading from "../../components/LottieLoading";
import SearchBar from "../../components/SearchBar";
import SpacedRepListItem from "../../components/SpacedRep/SpacedRepListItem";
import CalendarEvent from "../../extras/classes/EventsResourceClass";
import { getAllEvents, search } from "../../extras/BACKEND";
import ListEmpty from "../../components/ListEmpty";
import { getTextColor } from "../../components/CustomReactComponent/ImprovedText";
import Modal from "react-native-modal";

const SpacedRepList = ({ navigation }) => {
	const dispatch = useDispatch();
	const accessToken = useSelector((state) => state.gauth.AuthToken);
	const idToken = useSelector((state) => state.gauth.IdToken);
	const calID = useSelector((state) => state.gauth.calendarId);
	const signedIn = useSelector((state) => state.gauth.isSignedIn);
	const [selectedData, setSelectedData] = useState(null);
	const [eventsObjectArray, setObjectArray] = useState(null);
	const [refreshing, setRefresh] = useState(false);
	const colors = useSelector((state) => state.colors);
	const [searchText, setSearchText] = useState({ text: "", search: false });
	const [searchResults, setSearchResults] = useState([]);
	const [searching, setSearching] = useState(false);
	const searchRef = useRef();

	function creatingObjectArray(e) {
		const events = [];
		e.forEach(({ start, summary, id, extendedProperties }) => {
			const d = new CalendarEvent(
				start,
				start,
				summary,
				extendedProperties.private,
				id
			);
			events.push(d);
		});
		setObjectArray(events);
		setRefresh(false);
	}

	function refresh() {
		getAllEvents(accessToken, idToken, calID).then((e) =>
			creatingObjectArray(e.data.events)
		);
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
		// console.log(item);
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

	function renderSearch({ item, index }) {
		const date = new Date(item.end);
		const options = {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "long",
		};
		return (
			<View
				style={{
					width: Dimensions.get("screen").width,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						padding: 15,
						alignItems: "center",
					}}
				>
					<Text style={{ fontSize: 18, color: getTextColor(colors.levelTwo) }}>
						{item.summary}
					</Text>
					<Text
						style={{
							color: colors.accentColor,
							textDecorationLine: "underline",
							fontWeight: "bold",
							fontSize: 16,
						}}
					>
						{date.toLocaleDateString("en-US", options)}
					</Text>
				</View>
			</View>
		);
	}

	function submitSearch() {
		setSearching(true);
		if (searchText.text) {
			search(accessToken, idToken, calID, searchText.text)
				.then((e) => {
					setSearchResults(e.data.data);
					setSearching(false);
				})
				.catch((e) => console.log(e.response));
		} else {
			setSearching(false);
			setSearchText({ text: "", search: false });
		}
	}

	if (!eventsObjectArray) {
		return <Loading />;
	} else {
		return (
			<View
				style={[styles.container, { backgroundColor: colors.backgroundColor }]}
			>
				<View style={[styles.topBar]}>
					<SearchBar
						placeholder="Search by tags, title"
						extraStyles={{
							height: 40,
							backgroundColor: colors.levelTwo,
						}}
						placeholderTextColor={getTextColor(colors.levelTwo)}
						inputStyles={{ color: getTextColor(colors.levelTwo) }}
						iconColor={getTextColor(colors.levelTwo)}
						onChangeText={(text) => setSearchText({ text: text, search: true })}
						onEndEditing={() => {
							LayoutAnimation.configureNext(
								LayoutAnimation.Presets.easeInEaseOut
							);
							setSearchText({ text: searchText.text, search: true });
							submitSearch();
						}}
						ref={searchRef}
					/>
					<AntDesign
						name="pluscircle"
						size={35}
						color={getTextColor(colors.backgroundColor)}
						onPress={() => navigation.navigate("CreateEvent")}
					/>
				</View>
				{searchText.search ? (
					<View
						style={[{ backgroundColor: colors.levelTwo }, styles.searchStyle]}
					>
						{searching ? (
							<LottieView
								source={require("../../../assets/animations/loading4.json")}
								style={{ height: 80, width: 80 }}
								autoPlay
							/>
						) : null}
						<FlatList
							data={searchResults ? searchResults : []}
							renderItem={renderSearch}
							keyExtractor={(item) => item.id}
							ItemSeparatorComponent={() => (
								<View
									style={{
										backgroundColor: colors.levelFour,
										height: 1,
										marginHorizontal: 15,
									}}
								/>
							)}
						/>
					</View>
				) : null}
				<View style={[styles.section]}>
					<ListHeader
						text="Upcoming"
						extraStyle={{ paddingHorizontal: 5, paddingRight: 10 }}
					/>
					<FlatList
						data={eventsObjectArray}
						refreshing={refreshing}
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
							<ListEmpty
								text={"Looks empty boss. Try pulling down to refresh"}
							/>
						}
						ItemSeparatorComponent={() => <View style={{ height: 7 }}></View>}
						keyExtractor={(item) => item.id}
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
	searchStyle: {
		maxHeight: 150,
		justifyContent: "center",
		alignItems: "center",
		// margin: 5,
		width: Dimensions.get("window").width,
		borderRadius: 15,
		overflow: "hidden",
	},
});

export default SpacedRepList;

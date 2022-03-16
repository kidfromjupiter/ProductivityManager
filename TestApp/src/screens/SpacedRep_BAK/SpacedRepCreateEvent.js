import React, { useState, useEffect, useRef, useMemo } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Button,
	ScrollView,
} from "react-native";
import { DateTimeGenerator, spacedRepDateGen } from "../../extras/dateparser";
import { useDispatch, useSelector } from "react-redux";
import { addCalendar, addEvent, listCalendars } from "../../extras/GAuth";
import DateTimePicker from "@react-native-community/datetimepicker";
import GestureSlider from "../../components/GestureSlider";
import CalView from "../../components/SpacedRep/CalDate";
import SuccessAlert from "../../components/SuccessAnimation";
import Tags from "react-native-tags";

const CreateEvent = ({ navigation }) => {
	const accessToken = useSelector((state) => state.gauth.AuthToken);
	const calendarID = useSelector((state) => state.gauth.calendarID);
	const [modalVisible, setModalVisible] = useState(false);
	const [endDate, setEndDate] = useState(new Date());
	const [startDate, setStartDate] = useState(new Date());
	const [show_end, setShow_end] = useState(false);
	const [show_start, setShow_start] = useState(false);
	const [rep_count, setRepCount] = useState(0);
	const [title, setTitle] = useState("");
	const [tags, setTags] = useState();
	const [scrollEnabled, setScrollEnabled] = useState(true);
	const [repList, setRepList] = useState(0);

	// const flatlist = useRef(<FlatList></FlatList>);

	const onChange_start = (event, selectedDate) => {
		if (event.type == "set") {
			const currentDate = selectedDate || startDate;
			setShow_start(Platform.OS === "ios");
			setStartDate(currentDate);
		}
	};
	const onChange_end = (event, selectedDate) => {
		if (event.type == "set") {
			const currentDate = selectedDate || endDate;
			setShow_end(Platform.OS === "ios");
			setEndDate(currentDate);
		}
	};

	const createEventArray = () => {
		const days = Math.floor(
			(endDate.getTime() - startDate.getTime()) / 1000 / 3600 / 24
		);
		const dateArray = spacedRepDateGen(days, Math.round(rep_count));

		const CalObjectArray = DateTimeGenerator(
			startDate.toISOString().substring(0, 10),
			dateArray,
			title,
			{ tags: tags.toString() }
		);
		return CalObjectArray;
	};
	async function batchAdd() {
		const array = createEventArray();

		await array.map((element) => {
			addEvent(accessToken, element, calendarID).catch((e) =>
				console.log(e.response.data)
			);
		});
	}
	const onTitleChange = (text) => {
		setTitle(text);
	};

	const changeRepCount = (value) => {
		const amount = rep_count + value;
		if (amount >= 0) {
			// flatlist?.current?.scrollToIndex({
			// 	index: amount,
			// 	viewPosition: 0.5,
			// });
			setRepCount(amount);
		}
	};
	// useEffect(() => {}, []);
	// useMemo(() => {
	// 	if (!repList) {
	// 		let i = [];
	// 		for (let index = 0; index < 100; index++) {
	// 			i.push(index);
	// 		}
	// 		setRepList(i);
	// 	}
	// }, []);
	return (
		<View style={styles.container}>
			<ScrollView scrollEnabled={scrollEnabled}>
				<View style={[styles.section, styles.intro, { backgroundColor: null }]}>
					<Text style={styles.introText}>Lets get planning!</Text>
				</View>
				<View style={[styles.section, { flex: 1, minHeight: 150 }]}>
					<Text style={styles.subtitle}>What should the events be called?</Text>
					<TextInput
						placeholder="Title"
						style={styles.input}
						onChangeText={(text) => onTitleChange(text)}
					/>
				</View>
				<View
					style={[styles.section, styles.dates]}
					onTouchEnd={() => setShow_start(!show_start)}
				>
					<View style={styles.dateHolder}>
						<Text style={styles.subtitle}>When would you like to start?</Text>
						<CalView
							year={startDate.getFullYear()}
							date={startDate.getDate()}
							month={startDate.toString().substring(4, 7)}
						/>
					</View>

					{show_start && (
						<DateTimePicker
							testID="dateTimePicker"
							value={startDate}
							minimumDate={new Date()}
							mode="date"
							is24Hour={true}
							display="default"
							onChange={onChange_start}
						/>
					)}
				</View>
				<View
					style={[styles.section, styles.dates]}
					onTouchEnd={() => setShow_end(!show_end)}
				>
					<View style={styles.dateHolder}>
						<Text style={styles.subtitle}>
							When are you planning to finish?
						</Text>
						<CalView
							year={endDate.getFullYear()}
							date={endDate.getDate()}
							month={endDate.toString().substring(4, 7)}
						/>
					</View>
					{show_end && (
						<DateTimePicker
							testID="dateTimePicker"
							value={endDate}
							mode="date"
							is24Hour={true}
							display="default"
							minimumDate={startDate}
							onChange={onChange_end}
						/>
					)}
				</View>
				<View style={[styles.section, { flex: 1 }]}>
					<Text style={styles.subtitle}>Give the event a set of tags</Text>

					<Tags
						// style={{ flex: 1 }}
						textInputProps={{
							placeholder: "tags",
							autoCapitalize: "none",
							autoCorrect: false,
							autoComplete: "off",
						}}
						onChangeTags={(tags) => setTags(tags)}
						onTagPress={(index) => {
							let tagList = tags;
							tagList.splice(index, 1);
							setTags(tagList);
						}}
						tagTextStyle={{ fontSize: 16 }}
						containerStyle={{ justifyContent: "center" }}
						inputStyle={{
							backgroundColor: "#445168",
							borderRadius: 6,
							color: "white",
							height: 100,
							fontSize: 17,
						}}
					/>
				</View>
				<View style={[styles.section, styles.repCountHolder]}>
					<Text style={styles.subtitle}>
						How many repetitions would you like?
					</Text>
					<View style={{ justifyContent: "center", alignItems: "center" }}>
						{/* <FlatList
							data={repList}
							renderItem={({ item }) => {
								console.log("rendered");
								return (
									<Text style={[styles.textStyles, styles.repCount]}>
										{item}
									</Text>
								);
							}}
							keyExtractor={(item) => item}
							scrollEnabled={false}
							initialNumToRender={10}
							horizontal
							ref={flatlist}
							style={{ maxWidth: 60 }}
							inverted
							showsHorizontalScrollIndicator={false}
							onScrollToIndexFailed={() => {}}
							removeClippedSubviews
						/> */}
						<Text style={[styles.textStyles, styles.repCount]}>
							{Math.round(rep_count)}
						</Text>
					</View>

					<GestureSlider
						onTick={(velocity) => changeRepCount(velocity)}
						modifier={2}
						setScrolling={() => setScrollEnabled(true)}
						setNotScrolling={() => setScrollEnabled(false)}
					/>
				</View>

				<View style={styles.buttonHolder}>
					<Button
						title="Add to my Calendar"
						disabled={
							startDate.toISOString().substring(4, 15) ==
								endDate.toISOString().substring(4, 15) ||
							title.length == 0 ||
							rep_count == 0
						}
						onPress={() => batchAdd().then(setModalVisible(true))}
						color="#00D34B"
					/>
				</View>
			</ScrollView>
			<SuccessAlert
				setModalVisible={setModalVisible}
				modalVisible={modalVisible}
				navigation={navigation}
				destination="Spaced Repetition"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#191F2C",
		color: "white",
	},
	section: {
		marginHorizontal: 10,
		backgroundColor: "#2B3748",
		margin: 10,
		borderRadius: 10,
		padding: 15,
		justifyContent: "space-around",
	},
	dates: {
		flexDirection: "row",
		justifyContent: "center",
		height: 220,
		// backgroundColor: "red",
	},
	input: {
		backgroundColor: "white",
		maxHeight: 50,
		flex: 1,
		height: 40,
		borderRadius: 10,
		padding: 10,
	},
	dateHolder: {
		flex: 1,
		justifyContent: "space-around",
		alignItems: "center",
	},
	textStyles: {
		fontSize: 20,
		color: "white",
		textAlign: "center",
		margin: 10,
	},
	repCount: {
		fontSize: 45,
	},
	intro: {
		marginTop: 30,
		margin: 40,
		// backgroundColor:""
	},
	introText: {
		fontSize: 50,
		color: "white",
	},
	subtitle: {
		fontSize: 20,
		color: "white",
		textAlign: "left",
		margin: 10,
	},
	repCountHolder: {
		height: 250,
	},
	buttonHolder: {
		height: 70,
		alignItems: "flex-end",
		padding: 10,
	},
	tagsModal: {
		height: 250,
		width: 300,
		backgroundColor: "#2B3748",
		borderRadius: 10,
		padding: 10,
	},
	tagHolder: {},
	tag: {
		// padding: 8,
		paddingHorizontal: 8,
		paddingVertical: 5,
		margin: 2,
		backgroundColor: "#E2E2E2",
		borderRadius: 20,
	},
});

export default CreateEvent;
//slate moss
// backgroundColor: "#191F2C",
// levelOne: "#2B3748",
// levelTwo: "#445168",
// levelThree: "#586781",
// levelFour: "#97A7C2",
// textColor: "#D7D7D7", //light
// textColorTwo: "#BECADE", //dark
// accentColor: "#00D34B",

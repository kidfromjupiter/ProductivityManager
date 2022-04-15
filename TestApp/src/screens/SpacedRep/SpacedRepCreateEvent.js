import { AntDesign } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Calendar } from "react-native-calendars";
import DatePicker from "react-native-date-picker";
import Tags from "react-native-tags";
import { useDispatch, useSelector } from "react-redux";
import GestureSlider from "../../components/GestureSlider";
import ListHeader from "../../components/ListHeader";
import CustomButton from "../../components/SpacedRep/CustomButton";
import SuccessAlert from "../../components/SuccessAnimation";
import { DateTimeGenerator, spacedRepDateGen } from "../../extras/dateparser";
import { addEvent } from "../../extras/calendar";
import { setEvents } from "../../redux/CalendarSlice";
const CreateEvent = ({ navigation }) => {
	const accessToken = useSelector((state) => state.gauth.AuthToken);
	const calendarID = useSelector((state) => state.gauth.calendarID);
	const [modalVisible, setModalVisible] = useState(false);
	const [endDate, setEndDate] = useState(new Date());
	const [startDate, setStartDate] = useState(new Date());
	const [rep_count, setRepCount] = useState(0);
	const [title, setTitle] = useState("");
	const [tags, setTags] = useState();
	const [scrollEnabled, setScrollEnabled] = useState(true);
	const [show, setShow] = useState(false);
	const scrollViewRef = useRef();
	const [calendarEvents, setCalendarEvents] = useState([]);
	const [markedDates, setMarkedDates] = useState({});
	const [CalSliceMeta, setCalSliceMeta] = useState({ id: 0, spacedRep: null });

	const dispatch = useDispatch();

	const onChange_start = (date) => {
		setStartDate(date);
	};
	const onChange_end = (date) => {
		setEndDate(date);
	};

	const createEventArray = () => {
		const days = Math.floor(
			(endDate.getTime() - startDate.getTime()) / 1000 / 3600 / 24
		);
		const dateArray = spacedRepDateGen(days, Math.round(rep_count));

		const [CalObjectArray, markedDates, SpacedRepObj] = DateTimeGenerator(
			startDate.toISOString().substring(0, 10),
			dateArray,
			title,
			{ tags: tags?.toString() }
		);
		setCalendarEvents(CalObjectArray);
		setCalSliceMeta({ id: SpacedRepObj.id, spacedRep: SpacedRepObj });
		const markedObjects = {};
		markedDates.forEach((object) => {
			Object.assign(markedObjects, {
				[object]: { selected: true, selectedColor: "#00D34B" },
			});
		});
		setMarkedDates(markedObjects);
	};
	async function batchAdd() {
		await calendarEvents.map((element) => {
			dispatch(setEvents(CalSliceMeta));
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
			setRepCount(amount);
		}
	};
	const theme = {
		backgroundColor: "#ffffff",
		calendarBackground: "#ffffff",
		textSectionTitleColor: "#b6c1cd",
		textSectionTitleDisabledColor: "#d9e1e8",
		selectedDayBackgroundColor: "#00adf5",
		selectedDayTextColor: "#ffffff",
		todayTextColor: "#00adf5",
		dayTextColor: "#2d4150",
		textDisabledColor: "#d9e1e8",
		dotColor: "#00adf5",
		selectedDotColor: "#ffffff",
		arrowColor: "orange",
		disabledArrowColor: "#d9e1e8",
		textDayFontWeight: "300",
		textMonthFontWeight: "bold",
		textDayHeaderFontWeight: "300",
		textDayFontSize: 16,
		textMonthFontSize: 16,
		textDayHeaderFontSize: 16,
	};
	return (
		<View style={styles.container}>
			<ScrollView scrollEnabled={scrollEnabled} ref={scrollViewRef}>
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
				<ListHeader
					text="Select Starting date"
					extraStyle={{ paddingHorizontal: 10 }}
				/>
				<View style={[styles.section, styles.dates]}>
					<View style={styles.dateHolder}>
						<DatePicker
							date={startDate}
							minimumDate={new Date()}
							mode="date"
							onDateChange={onChange_start}
							fadeToColor="#2B3748"
							textColorLight="white"
						/>
					</View>
				</View>
				<ListHeader
					text="Select Ending date"
					extraStyle={{ paddingHorizontal: 10 }}
				/>
				<View style={[styles.section, styles.dates]}>
					<View style={styles.dateHolder}>
						<DatePicker
							date={endDate}
							minimumDate={startDate}
							mode="date"
							onDateChange={onChange_end}
							fadeToColor="#2B3748"
							textColorLight="white"
						/>
					</View>
				</View>
				<View style={[styles.section, { flex: 1 }]}>
					<Text style={styles.subtitle}>
						Give the event a set of tags seperated with spaces
					</Text>

					<Tags
						textInputProps={{
							placeholder: "tags",
							autoCapitalize: "none",
							autoCorrect: false,
							autoComplete: "off",
						}}
						onChangeTags={(tags) => setTags(tags)}
						onTagPress={(index) => {
							const tagList = tags;
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
				{!show ? (
					<View style={styles.buttonHolder}>
						<CustomButton
							text="Looks about right"
							color="#00D34B"
							textColorLight="white"
							callback={() => {
								setShow(true);
								createEventArray();
								scrollViewRef.current.scrollToEnd();
							}}
							disabled={
								startDate.toISOString().substring(4, 15) ==
									endDate.toISOString().substring(4, 15) ||
								title.length == 0 ||
								rep_count == 0
							}
							icon={<AntDesign name="check" size={24} color="white" />}
						/>
					</View>
				) : null}

				{show ? (
					<>
						<ListHeader
							text="This is how everything will look like"
							extraStyle={{ paddingHorizontal: 10 }}
						/>
						<View style={{ margin: 10 }}>
							<Calendar
								current={
									startDate.getFullYear() +
									"-" +
									(startDate.getMonth() + 1) +
									"-" +
									startDate.getDate()
								}
								firstDay={1}
								enableSwipeMonths={true}
								style={{ borderRadius: 10, overflow: "hidden" }}
								theme={theme}
								markedDates={markedDates}
								// markedDates={}
							/>
						</View>

						<View style={styles.buttonHolder}>
							<CustomButton
								text="Check again"
								color="#FF6700"
								callback={() => {
									setShow(false);
									setCalendarEvents([]);
									setMarkedDates({});
								}}
								textColorLight="white"
								icon={
									<AntDesign
										name="exclamationcircleo"
										size={24}
										color="white"
									/>
								}
							/>
							<CustomButton
								text="Add to calendar"
								color="#00D34B"
								textColorLight="white"
								callback={() => batchAdd().then(setModalVisible(true))}
								icon={<AntDesign name="calendar" size={24} color="white" />}
							/>
						</View>
						<View style={styles.buttonHolder}></View>
					</>
				) : null}
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
		alignItems: "center",
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
		padding: 10,
		flexDirection: "row",
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
// slate moss
// backgroundColor: "#191F2C",
// levelOne: "#2B3748",
// levelTwo: "#445168",
// levelThree: "#586781",
// levelFour: "#97A7C2",
// textColorLight: "#D7D7D7", //light
// textColorDark: "#BECADE", //dark
// accentColor: "#00D34B",

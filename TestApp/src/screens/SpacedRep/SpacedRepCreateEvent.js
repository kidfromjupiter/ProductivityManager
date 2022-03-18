import React, { useState } from "react";
import {
	Button,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import Tags from "react-native-tags";
import { useSelector } from "react-redux";
import GestureSlider from "../../components/GestureSlider";
import ListHeader from "../../components/ListHeader";
import SuccessAlert from "../../components/SuccessAnimation";
import { DateTimeGenerator, spacedRepDateGen } from "../../extras/dateparser";
import { addEvent } from "../../extras/GAuth";
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

		const CalObjectArray = DateTimeGenerator(
			startDate.toISOString().substring(0, 10),
			dateArray,
			title,
			{ tags: tags?.toString() }
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
			setRepCount(amount);
		}
	};
	console.log(startDate);
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
							textColor="white"
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
							textColor="white"
						/>
					</View>
				</View>
				<View style={[styles.section, { flex: 1 }]}>
					<Text style={styles.subtitle}>
						Give the event a set of tags seperated with spaces
					</Text>

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

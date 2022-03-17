import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
	Dimensions,
	FlatList, StyleSheet,
	Text, View
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import Animated, { SlideInDown } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { deleteEvent } from "../../extras/GAuth";
import InfoBar from "../InfoBar";
import CustomButton from "./CustomButton";

const TodayInfo = ({
	percentage,
	daysTill,
	id,
	repNumber,
	tags,
	title,
	today,
	totalReps,
	refreshCallback,
	percentFinished,
	repsRemaining,
	setStateCallback,
	setHide,
}) => {
	const calID = useSelector((state) => state.gauth.calendarID);
	const accessToken = useSelector((state) => state.gauth.AuthToken);

	const Tags = ({ name }) => {
		return <Text style={styles.tag}>{name}</Text>;
	};
	if (!title) {
		return <></>;
	} else {
		console.log("rendered");
		return (
			<Animated.View entering={SlideInDown}>
				<View style={[styles.container]}>
					<View style={[styles.metaHolder]}>
						<View style={styles.data}>
							{today ? (
								<Text
									style={{
										fontSize: 25,
										color: "#00D34B",
										fontWeight: "bold",
									}}
								>
									Today
								</Text>
							) : (
								<Text
									style={{
										fontSize: 25,
										color: "#00D34B",
										fontWeight: "bold",
									}}
								>
									Info
								</Text>
							)}

							<Text style={styles.title}>{title}</Text>
							<View style={styles.tagholder}>
								<AntDesign name="tags" size={18} color="#D7D7D7" />
								<FlatList
									style={styles.list}
									data={tags}
									horizontal
									renderItem={({ item }) => {
										return <Tags name={item} />;
									}}
									keyExtractor={(item) => item}
									showsHorizontalScrollIndicator={false}
								/>
							</View>
						</View>
						<View style={styles.progress}>
							<CircularProgress
								value={percentFinished}
								valueSuffix="%"
								activeStrokeColor="#00D34B"
								inActiveStrokeColor="#191F2C"
								in
								delay={10}
								subtitleFontSize={13}
								radius={55}
								fontSize={23}
							/>
							<InfoBar
								info={repsRemaining + " reps left"}
								customstyles={{ borderRadius: 7 }}
							/>
						</View>
					</View>
					<View style={styles.buttonHolder}>
						<View style={styles.topButtons}>
							<CustomButton
								callback={() => {
									deleteEvent(accessToken, id, calID)
										.then((e) => {
											refreshCallback();
											setStateCallback();
										})
										.catch((e) => console.log(e.response));
								}}
								color="#FF002D"
								text="Delete"
								textColor="#D7D7D7"
							/>
							{/* <CustomButton text="Modify" color="#586781" textColor="#D7D7D7" />
					<CustomButton text="Pomodoro" color="#586781" textColor="#D7D7D7" /> */}
						</View>
						{/* <View style={styles.bottomButtons}>
					<CustomButton color="#00D34B" text="Mark Completed" />
				</View> */}
					</View>
				</View>
			</Animated.View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get("window").width,
		flex: 1,
		backgroundColor: "#445168",
		borderTopEndRadius: 20,
		borderTopStartRadius: 20,
		maxHeight: 270,
	},

	completedButton: {},
	closeButton: {
		width: 30,
		height: 20,
		backgroundColor: "#445168",
		borderRadius: 5,
		alignItems: "center",
	},

	metaHolder: { flex: 4, flexDirection: "row" },
	buttonHolder: { flex: 1 },
	topButtons: {
		flex: 1,
		flexDirection: "row",
		marginBottom: 5,
	},
	bottomButtons: { flex: 1 },
	data: {
		flex: 6,
		justifyContent: "center",
		paddingLeft: 10,
	},
	progress: {
		flex: 4,
		justifyContent: "center",
		alignItems: "center",
		// backgroundColor: "red",
	},
	tag: {
		color: "#D7D7D7",
		marginHorizontal: 5,
		backgroundColor: "#586781",
		paddingHorizontal: 10,
		borderRadius: 5,
		textAlignVertical: "center",
		textAlign: "center",
		// maxHeight: 25,
	},
	title: {
		padding: 10,
		marginVertical: 15,
		backgroundColor: "#D7D7D7",
		borderRadius: 10,
		fontWeight: "bold",
		fontSize: 20,
	},
	list: {
		// maxHeight: 30,
	},
	tagholder: {
		flexDirection: "row",
	},
});

export default TodayInfo;

import React from "react";
import { Text, View, StyleSheet } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import InfoBar from "../InfoBar";
import LottieView from "lottie-react-native";

const QuickView = ({
	navigation,
	title,
	numberOfReps,
	repNumber,
	startDate,
	colors,
}) => {
	function day() {
		const day = new Date(startDate);
		return day.toUTCString().substring(0, 3);
	}
	function MonthandDate() {
		const day = new Date(startDate);
		return day.toUTCString().substring(5, 11);
	}
	return (
		<View style={styles.container}>
			<View>
				<View style={styles.titleContainer}>
					<Text style={[styles.textStyle, { fontWeight: "bold" }]}>
						{title}
					</Text>
				</View>
				<View
					style={[
						styles.dateHolder,
						{ justifyContent: "center", alignItems: "center" },
					]}
				>
					<Text style={[styles.textStyle, { fontSize: 20 }]}>{day()}</Text>
					<Text style={[styles.textStyle, { fontSize: 14 }]}>
						{MonthandDate()}
					</Text>
				</View>
			</View>
			<View>
				<CircularProgress
					radius={50}
					value={(repNumber / numberOfReps) * 100}
					valueSuffix="%"
				/>
			</View>
		</View>
	);
};

const QuickViewSub = ({ color }) => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				paddingBottom: 5,
			}}
		>
			<LottieView
				autoPlay
				loop={false}
				source={require("../../../assets/animations/wellDone.json")}
			/>
			{/* <Text style={{ fontSize: 15, color: color.textColor }}>
				Congrats! All caught up
			</Text> */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// justifyContent: "center",
		padding: 10,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-evenly",
	},
	titleContainer: {
		backgroundColor: "#445168",
		padding: 6,
		borderRadius: 10,
		paddingHorizontal: 10,
	},
	textStyle: {
		color: "white",
		fontSize: 17,
		textAlign: "center",
	},
	dateHolder: {
		// backgroundColor: "#445168",
		padding: 6,
		borderRadius: 10,
		marginTop: 5,
	},
});

export default QuickView;
export { QuickViewSub };

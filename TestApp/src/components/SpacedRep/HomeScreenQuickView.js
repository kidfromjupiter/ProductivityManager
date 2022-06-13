import LottieView from "lottie-react-native";
import moment from "moment";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { useSelector } from "react-redux";

const QuickView = ({
	navigation,
	title,
	numberOfReps,
	repNumber,
	startDate,
}) => {
	const colors = useSelector((state) => state.colors);
	return (
		<View style={styles.container}>
			<View>
				<View
					style={[
						styles.titleContainer,
						{ backgroundColor: colors.accentColor },
					]}
				>
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
					<Text
						style={[
							styles.textStyle,
							{ fontSize: 20, color: colors.textColorLight },
						]}
					>
						{moment(startDate).fromNow()}
					</Text>
				</View>
			</View>
			<View>
				<CircularProgress
					radius={50}
					activeStrokeColor={colors.accentColor}
					inActiveStrokeColor={colors.levelThree}
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
			{/* <Text style={{ fontSize: 15, color: color.textColorLight }}>
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

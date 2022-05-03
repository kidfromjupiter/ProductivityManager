import React from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment";
import { getTextColor } from "../CustomReactComponent/ImprovedText";
import { useSelector } from "react-redux";

export default function AllTime({ st, bt, at }) {
	const colors = useSelector((state) => state.colors);
	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<View
				style={{
					padding: 3,
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<Text style={styles.text}>Focus time</Text>
				<Text style={styles.text}>{`${moment
					.duration(st, "seconds")
					.hours()}h ${moment.duration(st, "seconds").minutes()}m`}</Text>
			</View>
			<View
				style={{
					padding: 3,
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<Text style={styles.text}>Break time</Text>
				<Text style={styles.text}>{`${moment
					.duration(bt, "seconds")
					.hours()}h ${moment.duration(bt, "seconds").minutes()}m`}</Text>
			</View>
			<View
				style={{
					padding: 3,
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<Text style={styles.text}>Total time on app</Text>
				<Text style={styles.text}>{`${moment
					.duration(at, "seconds")
					.hours()}h ${moment.duration(at, "seconds").minutes()}m`}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	text: {
		fontSize: 15,
		color: "white",
	},
});

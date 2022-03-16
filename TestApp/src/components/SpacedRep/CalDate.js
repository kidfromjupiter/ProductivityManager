import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CalView = ({ month, date, year, onPress }) => {
	return (
		<View style={styles.container} onTouchEnd={onPress}>
			<View style={styles.monthholder}>
				<Text style={[styles.text, styles.month]}>{month}</Text>
			</View>
			<View style={styles.dateholder}>
				<Text style={[styles.text, styles.date]}>{date}</Text>
			</View>
			<View style={styles.yearholder}>
				<Text style={[styles.text, styles.year]}>{year}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 150,
		// flex: 1,
		width: 140,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		margin: 30,
		// borderColor: "white",
		// borderWidth: 2,
	},
	yearholder: { flex: 1, alignItems: "center", justifyContent: "center" },
	dateholder: { flex: 3, alignItems: "center", justifyContent: "center" },
	monthholder: { flex: 1, alignItems: "center", justifyContent: "center" },
	text: {
		color: "white",
		textAlignVertical: "center",
	},
	month: {
		fontSize: 23,
		textAlignVertical: "bottom",
	},
	year: {
		fontSize: 17,
	},
	date: {
		fontSize: 50,
		fontWeight: "bold",
		color: "#00D34B",
	},
});

export default CalView;

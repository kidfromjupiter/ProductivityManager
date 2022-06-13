import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import moment from "moment";

const AverageDaily = ({ breaktime, focustime }) => {
	return (
		<View style={{ padding: 10 }}>
			<Text style={styles.titleText}>Daily average</Text>
			<View style={styles.subText}>
				<Text style={{ color: "white", fontSize: 16 }}>Focus time</Text>
				<Text style={{ color: "white", fontSize: 16 }}>
					{moment.duration(focustime, "minutes").asMinutes()} mins
				</Text>
			</View>
			<View style={styles.subText}>
				<Text style={{ color: "white", fontSize: 16 }}>Break time</Text>
				<Text style={{ color: "white", fontSize: 16 }}>
					{moment.duration(breaktime, "minutes").asMinutes()} mins
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	titleText: {
		fontSize: 20,
		fontWeight: "bold",
		paddingVertical: 10,
		color: "white",
		zIndex: 10,
	},
	subText: {
		// paddingHorizontal: 10,
		flexDirection: "row",
		paddingVertical: 2,
		justifyContent: "space-between",
	},
});

export default AverageDaily;

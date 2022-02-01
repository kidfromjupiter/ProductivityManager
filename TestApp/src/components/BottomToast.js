import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const BottomToast = ({ text }) => {
	return (
		<View style={styles.rootContainer}>
			<View style={styles.toastContainer}>
				<Text style={styles.text}>{text}</Text>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		zIndex: 10,
		position: "absolute",
		bottom: 40,
		left: 0,
		right: 0,
	},
	text: {
		fontSize: 13,
		color: "white",
		textAlign: "center",
	},
	toastContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
export default BottomToast;

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

const BottomToast = ({ text }) => {
	const colors = useSelector((state) => state.colors);
	return (
		<View style={styles.rootContainer}>
			<View style={styles.toastContainer}>
				<Text style={[styles.text, { color: colors.textColorLight }]}>
					{text}
				</Text>
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

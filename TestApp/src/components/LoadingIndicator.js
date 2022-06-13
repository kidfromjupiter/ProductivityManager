import React from "react";
import { View } from "react-native-animatable";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

export default function LoadingPopup({ customStyles }) {
	return (
		<View style={[styles.container, customStyles]}>
			<LottieView
				source={require("../../assets/animations/loading5.json")}
				autoPlay
				style={{ width: 50, height: 50 }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 50,
		width: 50,
		backgroundColor: "#3A3A3A",
		position: "absolute",
		right: 15,
		bottom: 15,
		zIndex: 1000,
		borderRadius: 100,
	},
});

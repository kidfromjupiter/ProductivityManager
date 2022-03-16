import React from "react";
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";

export default function Loading({ lottieStyle, containerStyle }) {
	return (
		<View
			style={[
				{
					flex: 1,
					backgroundColor: "black",
					justifyContent: "center",
					alignItems: "center",
				},
				containerStyle,
			]}
		>
			<LottieView
				source={require("../../assets/animations/loading3.json")}
				style={[{ height: 120, width: 120 }, lottieStyle]}
				autoPlay
				loop
			/>
		</View>
	);
}

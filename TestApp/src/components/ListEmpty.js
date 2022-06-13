import React from "react";
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";

const ListEmpty = ({ text }) => {
	return (
		<View style={{ justifyContent: "center", alignItems: "center" }}>
			<Text style={{ color: "grey", textAlign: "center", padding: 20 }}>
				{text}
			</Text>
			<LottieView
				source={require("../../assets/animations/empty.json")}
				autoPlay
				loop={false}
				style={{
					backgroundColor: "transparent",
					height: 100,
					width: 200,
				}}
				speed={1.2}
			/>
		</View>
	);
};

export default ListEmpty;

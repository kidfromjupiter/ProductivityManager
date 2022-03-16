import React, { useState } from "react";
import LottieView from "lottie-react-native";
import { View, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";

const SuccessAlert = ({
	navigation,
	destination,
	modalVisible,
	setModalVisible,
}) => {
	const [progress, setProgress] = useState(0);
	return (
		<Modal
			isVisible={modalVisible}
			onModalShow={() => setProgress(0)}
			useNativeDriver
			animationIn="pulse"
			animationOut="zoomOut"
		>
			<View style={styles.container}>
				<View>
					<LottieView
						source={require("../../assets/animations/success3.json")}
						autoPlay
						loop={false}
						progress={progress}
						style={{
							backgroundColor: "transparent",
							height: 200,
							width: 200,
						}}
						onAnimationFinish={() => {
							setModalVisible(false);
							// console.log("called");
							navigation ? navigation.navigate(destination) : null;
						}}
						speed={1.2}
					/>
				</View>
				<View>
					{/* <Text
						style={{
							fontSize: 25,
							color: "white",
							padding: 20,
							textAlign: "center",
						}}
					>
						Success!
					</Text> */}
				</View>
			</View>
		</Modal>
	);
};
const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		// overflow: "hidden",
		alignSelf: "center",
		maxHeight: 100,
		maxWidth: 100,
	},
});
export default SuccessAlert;

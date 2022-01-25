import React from "react";
import {
	TextInput,
	StyleSheet,
	View,
	Text,
	Dimensions,
	TouchableOpacity,
	NativeModules,
	LayoutAnimation,
} from "react-native";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
	UIManager.setLayoutAnimationEnabledExperimental(true);

const DialogBox = ({ onChangeText, onSubmit, onCancel, isDescription }) => {
	let text;
	let description;
	return (
		<View style={styles.OuterContainer}>
			<View style={styles.Overlay}></View>
			<View style={styles.container}>
				<View style={styles.InputHolder}>
					<Text style={styles.titleTexts}>Title</Text>
					<TextInput
						style={styles.input}
						placeholder="Reminder"
						onChangeText={(input) => (text = input)}
						value={text}
					/>
					<Text style={styles.titleTexts}>Description</Text>
					{isDescription ? (
						<TextInput
							multiline={true}
							style={[styles.input, styles.description]}
							placeholder="Reminder"
							onChangeText={(input) => (description = input)}
							value={text}
						/>
					) : null}
				</View>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={[
							styles.button,
							{
								// borderRightWidth: 1,
								// borderRightColor: "#CCCCCC",
							},
						]}
						onPress={() => {
							onCancel(false);
							LayoutAnimation.configureNext(
								LayoutAnimation.Presets.easeInEaseOut
							);
						}}
					>
						<Text style={[styles.text, { color: "#ED1717" }]}>Cancel</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.button, {}]}
						onPress={() => {
							onSubmit(text, description);
						}}
					>
						<Text style={[styles.text, { color: "#0050D8" }]}>Add</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	titleTexts: {
		fontSize: 19,
		color: "#D7D7D7",
		fontWeight: "bold",
		textAlign: "left",
		marginVertical: 10,
	},
	Overlay: {
		backgroundColor: "rgba(0,0,0,0.5)",
		position: "absolute",
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width,
	},

	OuterContainer: {
		flex: 1,
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
	},
	container: {
		zIndex: 200,
		flex: 1,
		backgroundColor: "#0F0021",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		// maxHeight: 400,
		// maxWidth: 300,
		height: "auto",
		width: "auto",
	},
	input: {
		width: 250,
		borderWidth: 1,
		borderRadius: 10,
		marginBottom: 10,
		padding: 10,
		borderColor: "#CCCCCC",
		color: "#FFFFFF",
		backgroundColor: "#0F0021",
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		maxHeight: 75,
	},
	button: {
		width: 150,
		color: "white",
		padding: 10,
		justifyContent: "center",
		alignItems: "center",
		borderTopWidth: 1,
		borderTopColor: "#CCCCCC",
		fontSize: 17,
	},
	text: {
		textAlignVertical: "center",
		textAlign: "center",
		fontSize: 17,
	},
	InputHolder: {
		flex: 2,
		justifyContent: "center",
		// alignItems: "center",
		paddingVertical: 20,
	},
	description: {
		height: 100,
		textAlignVertical: "top",
	},
});

export default DialogBox;

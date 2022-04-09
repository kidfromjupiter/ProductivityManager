import React from "react";
import {
	Dimensions,
	LayoutAnimation,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const DialogBox = ({
	onChangeText,
	onSubmit,
	onCancel,
	isDescription,
	color,
}) => {
	let text;
	let description;
	return (
		<View style={styles.OuterContainer}>
			<View
				style={[
					styles.container,
					{ backgroundColor: color ? color.levelOne : null },
				]}
			>
				<View style={styles.InputHolder}>
					<Text style={styles.titleTexts}>Title</Text>
					<TextInput
						style={[
							styles.input,
							{ backgroundColor: color ? color.levelTwo : null },
						]}
						autoFocus
						onChangeText={(input) => (text = input)}
						value={text}
						maxLength={80}
					/>
					<Text style={styles.titleTexts}>Description</Text>
					{isDescription ? (
						<TextInput
							multiline={true}
							style={[
								styles.input,
								styles.description,
								{ backgroundColor: color ? color.levelTwo : null },
							]}
							onChangeText={(input) => (description = input)}
							value={text}
						/>
					) : null}
				</View>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={[styles.button]}
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

	OuterContainer: {
		flex: 1,
		// position: "absolute",
		maxHeight: 350,
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
		height: "auto",
		width: "auto",
	},
	input: {
		width: 250,
		borderRadius: 10,
		marginBottom: 10,
		padding: 10,
		borderBottomColor: "#909090",
		backgroundColor: "#252525",
		color: "white",
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		maxHeight: 50,
	},
	button: {
		width: 150,
		color: "white",
		padding: 10,
		justifyContent: "center",
		alignItems: "center",
		borderTopWidth: 1,
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

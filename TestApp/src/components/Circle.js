import React from "react";
import { StyleSheet, Text, View } from "react-native";

const InfoCircle = ({
	setRadius,
	numberSize,
	textSize,
	number,
	text,
	radius,
	color,
	customStyles,
	textColor,
	adjustMargin,
	backgroundColor,
}) => {
	return (
		<View
			style={[
				styles.container,
				{
					width: setRadius ? radius : null,
					height: setRadius ? radius : null,
					borderRadius: radius / 2,
					borderColor: color,
					backgroundColor: backgroundColor,
				},
				customStyles,
				{ flex: setRadius ? 0 : 1 },
			]}
		>
			<View style={styles.Number}>
				<Text
					style={[
						styles.text,
						styles.number,
						{ fontSize: numberSize, color: textColor },
					]}
				>
					{number}
				</Text>
			</View>
			{text ? (
				<View style={(styles.Text, { marginTop: adjustMargin })}>
					<Text style={[styles.text, { fontSize: textSize, color: textColor }]}>
						{text}
					</Text>
				</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		flex: 1,
	},
	text: {
		textAlign: "center",
		// textAlignVertical: "center",
	},
	Text: {
		// flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	number: {
		fontSize: 30,
	},
});

export default InfoCircle;

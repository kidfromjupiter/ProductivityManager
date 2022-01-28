import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InfoCircle = ({ number, text, radius, color }) => {
	return (
		<View
			style={[
				{
					width: radius,
					height: radius,
					borderRadius: radius / 2,
					backgroundColor: color,
				},
			]}
		>
			<View style={styles.Number}>
				<Text>{number}</Text>
			</View>
			<View style={styles.Text}>
				<Text>{text}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({});

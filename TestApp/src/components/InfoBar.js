import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoBar = ({ info, customstyles }) => {
	return (
		<View style={[styles.container, customstyles]}>
			<Text style={styles.text}>{info}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		elevation: 5,
		padding: 5,
		margin: 5,
	},
	text: {
		fontWeight: 'bold',
		textAlign: 'right',
	},
});

export default InfoBar;

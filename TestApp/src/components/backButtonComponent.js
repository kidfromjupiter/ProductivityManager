import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text } from 'react-native';

const BackButton = ({ navigation, color }) => {
	if (Platform.OS === 'ios') {
		return (
			<SafeAreaView style={styles.container}>
				<Text
					style={{
						color: color.textColor,
						textDecorationLine: 'underline',
					}}
					onPress={() => {
						navigation.goBack();
					}}
				>
					Go Back
				</Text>
			</SafeAreaView>
		);
	}
	return null;
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 10,
		left: 10,
		zIndex: 10000,
	},
});

export default BackButton;

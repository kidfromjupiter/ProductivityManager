import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableHighlight,
} from "react-native";

const SettingsListItem = ({ callback, text, subText }) => {
	return (
		<TouchableHighlight
			style={styles.container}
			onPress={() => (callback ? callback() : null)}
		>
			<View style={{ maxWidth: Dimensions.get("window").width - 80 }}>
				<View style={styles.titleHolder}>
					<Text style={{ color: "white", fontSize: 18 }}>{text}</Text>
				</View>
				<View style={styles.subTextHolder}>
					<Text style={{ color: "grey" }}>{subText}</Text>
				</View>
			</View>
		</TouchableHighlight>
	);
};

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get("window").width,
		backgroundColor: "black",
		borderBottomWidth: 1,
		borderBottomColor: "grey",
		padding: 10,
	},
	titleHolder: {
		paddingBottom: 5,
	},
	subTextHolder: {
		paddingBottom: 5,
	},
});

export default SettingsListItem;

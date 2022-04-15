import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

const SettingsListItem = ({
	callback,
	text,
	subText,
	customStyles,
	subTextColor,
}) => {
	const color = useSelector((state) => state.colors);
	return (
		<TouchableOpacity
			style={[styles.container, customStyles]}
			onPress={() => (callback ? callback() : null)}
		>
			<View style={{ maxWidth: Dimensions.get("window").width - 80 }}>
				<View style={styles.titleHolder}>
					<Text style={{ color: color.textColorLight, fontSize: 18 }}>
						{text}
					</Text>
				</View>
				<View style={styles.subTextHolder}>
					<Text style={[{ color: subTextColor ? subTextColor : "grey" }]}>
						{subText}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get("window").width,
		padding: 10,
	},
	titleHolder: {
		paddingBottom: 5,
	},
	subTextHolder: {},
});

export default SettingsListItem;

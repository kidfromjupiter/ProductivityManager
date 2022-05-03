import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import ImprovedText from "../CustomReactComponent/ImprovedText";

const SettingsListItem = ({
	callback,
	text,
	subText,
	customStyles,
	subTextColor,
	backgroundColor,
}) => {
	const color = useSelector((state) => state.colors);
	return (
		<TouchableOpacity
			style={[styles.container, customStyles]}
			onPress={() => (callback ? callback() : null)}
		>
			<View style={{ maxWidth: Dimensions.get("window").width - 80 }}>
				<View style={styles.titleHolder}>
					<ImprovedText
						text={text}
						backgroundColor={backgroundColor}
						style={{ fontSize: 18 }}
					/>
				</View>
				<View style={styles.subTextHolder}>
					<ImprovedText text={subText} backgroundColor={backgroundColor} />
					{/* <Text style={[{ color: subTextColor ? subTextColor : "grey" }]}>
						{subText}
					</Text> */}
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

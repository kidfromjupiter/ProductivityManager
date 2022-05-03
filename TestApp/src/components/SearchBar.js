import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const SearchBar = React.forwardRef(
	(
		{
			onChangeText,
			onEndEditing,
			placeholder,
			extraStyles,
			iconColor,
			placeholderTextColor,
			inputStyles,
		},
		ref
	) => {
		return (
			<View style={[styles.container, extraStyles]}>
				<TextInput
					style={[styles.inputStyles, inputStyles]}
					placeholder={placeholder}
					onChangeText={onChangeText}
					onSubmitEditing={onEndEditing}
					placeholderTextColor={placeholderTextColor}
					ref={ref}
				/>
				<View>
					<AntDesign
						name="search1"
						size={24}
						color={iconColor ? iconColor : "black"}
					/>
				</View>
			</View>
		);
	}
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "white",
		maxHeight: 50,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 25,
		marginHorizontal: 10,
		overflow: "hidden",
		paddingHorizontal: 15,
	},
	inputStyles: { flex: 1 },
});

export default SearchBar;

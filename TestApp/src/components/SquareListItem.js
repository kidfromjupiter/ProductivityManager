import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import Square from "./square";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const WIDTH = Dimensions.get("window").width;
const EXPAND_HEIGHT = Dimensions.get("window").height;

export default function SquareListItem({
	text,
	touchEndCallBack,
	index,
	desc,
	completed,
	deleteItem,
}) {
	const [expanded, setExpanded] = useState({
		width: WIDTH / 2 - 10,
		height: 0,
		translateX: 0,
	});
	const [meta, setMeta] = useState({ height: 0, width: 0 });

	const color = useSelector((state) => state.colors);

	const setExpandedProps = () => {
		expanded.height > 0
			? setExpanded({ width: WIDTH / 2 - 10, height: 0 })
			: setExpanded({ width: WIDTH / 2 + 10, height: EXPAND_HEIGHT / 4 });
	};

	const setTranslations = () => {
		if (expanded.height > 0 && index % 2 == 1) {
			return -35;
		}
		return 0;
	};
	const setLayout = (event) => {
		const { height, width } = event.nativeEvent.layout;
		setMeta({ height: height, width: width });
	};

	return (
		<View
			style={{
				transform: [{ translateX: setTranslations() }],
				zIndex: expanded.height > 0 ? 100 : 0,
			}}
			onLayout={setLayout}
		>
			<Square
				text={text}
				customStyles={{
					width: expanded.width,
					height: expanded.height != 0 ? expanded.height : null,
					marginVertical: 0,
					borderWidth: expanded.height > 0 ? 2 : 0,
					borderColor: color.levelThree,
					marginHorizontal: 3,
					padding: 0,
				}}
				titleStyle={{ color: "white", padding: 10 }}
				showTitle
				touchEndCallback={() => touchEndCallBack(index)}
				enableLongPress
				ParentHoldCallback={() => {
					setExpandedProps();
				}}
			>
				{expanded.height > 0 ? (
					<View style={styles.textHolder}>
						<Text style={styles.text}>{desc}</Text>
					</View>
				) : null}
				{expanded.height > 0 && meta.width != 0 ? (
					<View style={[styles.iconHolder, { height: meta.height }]}>
						<TouchableOpacity
							onPress={() => {
								deleteItem(index);
							}}
							hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
							style={[styles.iconStyle, { backgroundColor: color.levelThree }]}
						>
							<Ionicons name="ios-trash-outline" size={28} color="white" />
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								touchEndCallBack(index);
							}}
							hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
							style={[styles.iconStyle, { backgroundColor: color.levelThree }]}
						>
							<AntDesign name="check" size={28} color="white" />
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.iconStyle, { backgroundColor: color.levelThree }]}
							hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
						>
							<AntDesign name="clockcircleo" size={28} color="white" />
						</TouchableOpacity>
					</View>
				) : null}
			</Square>
		</View>
	);
}

const styles = StyleSheet.create({
	text: {
		color: "#BECADE",
	},
	textHolder: {
		marginRight: 3,
		marginLeft: 10,
		paddingBottom: 10,
		overflow: "hidden",
	},
	iconHolder: {
		position: "absolute",
		right: -20,
		bottom: 0,
	},
	iconStyle: {
		borderRadius: 20,
		padding: 7,
		marginVertical: 5,

		// zIndex: ,
		// flex: 1,
		// wid,
	},
});

import React, { useEffect, useState } from "react";
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
import Animated, {
	withTiming,
	withRepeat,
	useSharedValue,
	useAnimatedStyle,
} from "react-native-reanimated";
import { getTextColor } from "./CustomReactComponent/ImprovedText";

const WIDTH = Dimensions.get("window").width;
const EXPAND_HEIGHT = Dimensions.get("window").height;

export default function SquareListItem({
	text,
	touchEndCallBack,
	index,
	desc,
	completed,
	deleteItem,
	pulseColor,
}) {
	const [expanded, setExpanded] = useState({
		width: WIDTH / 2 - 10,
		height: 0,
		translateX: 0,
	});
	const [meta, setMeta] = useState({ height: 0, width: 0 });
	const opacity = useSharedValue(1);
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

	const style_animated = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
		};
	});

	useEffect(() => {
		opacity.value = withRepeat(withTiming(0, { duration: 1400 }), -1, true);
	}, [expanded]);

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
					marginVertical: 5,
					borderWidth: expanded.height > 0 ? 2 : 0,
					borderColor: color.levelThree,
					marginHorizontal: 3,
					padding: 0,
					minHeight: 90,
					backgroundColor: color.levelOne,
				}}
				titleStyle={{ color: getTextColor(color.levelThree), padding: 10 }}
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
							<Ionicons
								name="ios-trash-outline"
								size={28}
								color={color.textColorDark}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								touchEndCallBack(index);
							}}
							hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
							style={[styles.iconStyle, { backgroundColor: color.levelThree }]}
						>
							<AntDesign name="check" size={28} color={color.textColorDark} />
						</TouchableOpacity>
						{/* <TouchableOpacity
							style={[styles.iconStyle, { backgroundColor: color.levelThree }]}
							hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
						>
							<AntDesign
								name="clockcircleo"
								size={28}
								color={color.textColorDark}
							/>
						</TouchableOpacity> */}
					</View>
				) : null}
				{!expanded.height > 0 && desc ? (
					<Animated.View
						style={[
							{
								position: "absolute",
								top: 10,
								right: 10,
								width: 15,
								height: 15,
								borderRadius: 15,
								backgroundColor: "#ffb700",
								zIndex: 10,
								justifyContent: "center",
								alignItems: "center",
							},
							style_animated,
						]}
					></Animated.View>
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

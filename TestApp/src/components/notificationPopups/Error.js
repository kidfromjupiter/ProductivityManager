import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
	Extrapolation,
	interpolate,
	runOnJS,
	Extrapolate,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { _REMOVE_error } from "../../redux/ErrorSlice";

export default function ErrorPopup({ message, icon, setState }) {
	const top = useSharedValue(-50);
	const width = useSharedValue(40);
	const [display, setdisplay] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		top.value = withSpring(50, null, (finished) => {
			if (finished) {
				width.value = withTiming(300, null, (finished) => {
					if (finished) {
						runOnJS(setdisplay)(true);
						width.value = withDelay(
							3000,
							withTiming(40, null, (finished) => {
								runOnJS(setdisplay)(false);
								if (finished) {
									top.value = withSpring(-50, null, (finished) => {
										runOnJS(setState)(true);
									});
								}
							})
						);
					}
				});
			}
		});
	}, []);

	const fadeInDown = useAnimatedStyle(() => {
		return {
			top: top.value,
			opacity: interpolate(top.value, [-30, 50], [0, 1], Extrapolate.CLAMP),
		};
	});
	const extend = useAnimatedStyle(() => {
		return {
			width: width.value,
		};
	});
	return (
		<Animated.View style={[styles.container, fadeInDown]}>
			<Animated.View style={[styles.textHolder, extend]}>
				<AntDesign name="exclamationcircle" size={30} color="orange" />
				{display ? (
					<View style={{ flex: 1, alignItems: "center", maxHeight: 30 }}>
						<Text style={styles.text}>{message}</Text>
					</View>
				) : null}
			</Animated.View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		// top: 50,
		width: Dimensions.get("screen").width,
		zIndex: 10000,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		maxHeight: 50,
	},
	textHolder: {
		flex: 1,
		flexDirection: "row",
		// justifyContent: "",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 50,
		padding: 4,
		overflow: "hidden",
	},
	text: {
		// fontWeight: "bold",
		fontSize: 15,
	},
});

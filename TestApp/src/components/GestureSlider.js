import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	Touchable,
	Pressable,
	LayoutAnimation,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
	PanGestureHandler,
} from "react-native-gesture-handler";

const GestureSlider = ({
	onTick,
	customState,
	modifier,
	setScrolling,
	setNotScrolling,
}) => {
	const [prevLoc, setprevLoc] = useState(null);
	const [height, setHeight] = useState(24);

	const animation = LayoutAnimation.create(
		75,
		LayoutAnimation.Types.linear,
		LayoutAnimation.Properties.opacity
	);

	function gestureCal(location, timestamp) {
		if (!customState ? !prevLoc : !customState) {
			setprevLoc({ loc: location, time: timestamp });
		} else {
			const timeSpent = timestamp - prevLoc.time;
			const displacement = location - prevLoc.loc;

			// if (!(Math.abs(displacement) < 1)) {
			const velocity = (displacement / timeSpent / 2) * modifier;
			onTick(velocity);
			// if (Math.abs(velocity) > 1) {
			// }
			// }
			setprevLoc({ loc: location, time: timestamp });
		}
	}
	function increase(value) {
		onTick(1);
	}
	function decrease(value) {
		onTick(-1);
	}

	return (
		<View style={styles.topContainer}>
			<View
				style={[styles.container]}
				onStartShouldSetResponder={() => true}
				onMoveShouldSetResponder={(evt) => true}
				onResponderMove={(event) => {
					gestureCal(event.nativeEvent.pageX, event.nativeEvent.timestamp);
				}}
				onResponderGrant={() => {
					setNotScrolling();
				}}
				onResponderRelease={(evt) => {
					setScrolling();
				}}
			>
				<View
					onTouchEnd={() => {
						decrease(1);
					}}
				>
					<Feather style={[styles.icon]} name="minus" size={25} color="black" />
				</View>
				<View
					onTouchEnd={() => {
						increase(1);
					}}
				>
					<Feather style={[styles.icon]} name="plus" size={25} color="black" />
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#00D34B",
		flex: 1,
		borderRadius: 50,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		// maxHeight: 50,
		height: 50,
		// ],
	},
	topContainer: {
		flex: 1,
		// maxHeight: 50,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	icon: {
		// padding: 10,
		backgroundColor: "white",
		zIndex: 10,
		borderRadius: 25,
		height: 50,
		width: 50,
		textAlignVertical: "center",
		textAlign: "center",
	},
	button: {
		borderRadius: 50,
		backgroundColor: "#97A7C2",
		margin: 3,
		justifyContent: "center",
		// height: 50,
		// width: 50,
	},
});

export default GestureSlider;

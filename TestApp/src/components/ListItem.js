/* eslint-disable react/prop-types */
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import {
	Animated,
	LayoutAnimation,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
	GestureHandlerRootView,
	Swipeable,
} from "react-native-gesture-handler";
import { useSelector } from "react-redux";

// const Vector

const ListItem = ({ item, index, setCompleteCallback, swipeRight }) => {
	const colors = useSelector((state) => state.colors);

	const [expanded, setExpanded] = useState(false);

	const setComplete = () => {
		setCompleteCallback(index);
		setExpanded(false);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	};
	const LeftActions = (progress, dragX) => {
		const trans = dragX.interpolate({
			inputRange: [0, 50, 100, 101],
			outputRange: [-40, 5, 5, 6],
			extrapolate: "clamp",
		});
		const opacity = dragX.interpolate({
			outputRange: [0, 1],
			inputRange: [0, 100],
			extrapolate: "clamp",
		});

		return (
			<Animated.View style={[styles.animatedHolder, { opacity: opacity }]}>
				<Animated.Text
					style={[styles.animatedText, { transform: [{ translateX: trans }] }]}
				>
					<AntDesign name="delete" size={24} color="white" />
				</Animated.Text>
			</Animated.View>
		);
	};

	return (
		<GestureHandlerRootView>
			<Swipeable
				renderLeftActions={LeftActions ? LeftActions : null}
				friction={2.8}
				leftThreshold={100}
				onSwipeableOpen={(direction) => {
					if (direction == "left") {
						swipeRight(index);
					}
				}}
			>
				<Pressable
					style={[
						styles.outerContainer,
						{ backgroundColor: item.completed ? "#6B6B6B" : colors.levelOne },
					]}
				>
					<View style={styles.innerContainer}>
						<View
							style={[
								styles.checkboxHolder,
								// eslint-disable-next-line react-native/no-inline-styles
								{
									height: expanded ? null : 70,
									paddingVertical: expanded ? 15 : null,
								},
							]}
						>
							<BouncyCheckbox
								onPress={() => {
									setComplete();
								}}
								bounceEffect={1}
								size={30}
								isChecked={item.completed}
								disableBuiltInState
								text={item.title}
								textStyle={styles.text}
								useNativeDriver
								fillColor={colors.accentColor}
								onLongPress={() => {
									setExpanded(!expanded);
									LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
								}}
							/>
							{expanded ? (
								<Text style={styles.descriptionStyle}>{item.description}</Text>
							) : null}
						</View>
						{/* <View
					style={styles.expand}
					onTouchEnd={() => {
						swipeRight(index);
						LayoutAnimation.configureNext(
							LayoutAnimation.Presets.easeInEaseOut
						);
					}}
				>
					<AntDesign name="minus" size={24} color="white" />
				</View> */}
					</View>
				</Pressable>
			</Swipeable>
		</GestureHandlerRootView>
	);
};
const styles = StyleSheet.create({
	outerContainer: {
		flex: 1,
		borderRadius: 10,
		backgroundColor: "#130039",
		// height: 70,
		flexDirection: "row",
		marginHorizontal: 10,
		zIndex: 5,
	},
	innerContainer: {
		flex: 1,
		flexDirection: "row",
		// padding: 15,
	},
	checkboxHolder: {
		width: 100,
		height: 70,
		flex: 5,
		justifyContent: "center",
		paddingLeft: 15,
	},
	text: {
		fontSize: 17,
		color: "white",
	},
	expand: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		// display: "none",
	},
	descriptionStyle: {
		fontSize: 13,
		color: "white",
		paddingVertical: 10,
	},
	animatedHolder: {
		flex: 1,
		backgroundColor: "#FF002D",
		justifyContent: "center",
	},
	animatedText: {
		color: "white",
		paddingHorizontal: 10,
		fontWeight: "600",
	},
});

export default ListItem;

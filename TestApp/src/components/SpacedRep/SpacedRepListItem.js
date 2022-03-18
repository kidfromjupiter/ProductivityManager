import { AntDesign } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Animated, FlatList, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {
	default as Anim,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { deleteEvent } from "../../extras/GAuth";

const Tags = ({ name }) => {
	return <Text style={styles.tag}>{name}</Text>;
};

const LeftActions = (progress, dragX) => {
	const trans = dragX.interpolate({
		inputRange: [0, 50, 100, 101],
		outputRange: [-40, 0, 0, 1],
		extrapolate: "clamp",
	});

	return (
		<View
			style={{ flex: 1, backgroundColor: "#FF002D", justifyContent: "center" }}
		>
			<Animated.Text
				style={{
					color: "white",
					paddingHorizontal: 10,
					fontWeight: "600",
					transform: [{ translateX: trans }],
				}}
			>
				<AntDesign name="delete" size={24} color="white" />
			</Animated.Text>
		</View>
	);
};

const SpacedRepListItem = ({
	title,
	daysTill,
	reps,
	totalreps,
	id,
	calendarId,
	accessToken,
	tags,
	onPressCallback,
	spacedRepId,
	percentFinished,
	repsRemaining,
	repsLeft,
	index,
	updateObjectArray,
	slideDelete,
}) => {
	const calID = useSelector((state) => state.gauth.calendarID);
	const rotation = useSharedValue(0);
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${rotation.value}deg` }],
		};
	});

	useEffect(() => {
		if (daysTill == 0) {
			onPressCallback
				? onPressCallback({
						today: true,
						title: title,
						id: id,
						accessToken: accessToken,
						calendarId: calendarId,
						tags: tags,
						reps: reps,
						daysTill: daysTill,
						totalreps: totalreps,
						spacedRepId: spacedRepId,
						percentFinished: percentFinished,
						repsRemaining: repsRemaining,
				  })
				: null;
		} else {
			onPressCallback ? onPressCallback(null) : null;
		}
	}, []);

	return (
		<GestureHandlerRootView>
			<Swipeable
				renderLeftActions={slideDelete ? LeftActions : null}
				friction={2.5}
				leftThreshold={50}
				onSwipeableOpen={() => {
					updateObjectArray(index);
					deleteEvent(accessToken, id, calID).catch((e) =>
						console.log(e.response)
					);
				}}
			>
				<Anim.View
					style={[styles.container, animatedStyle]}
					onTouchEnd={() => {
						rotation.value = withSequence(
							withTiming(-1, { duration: 50 }),
							withRepeat(withTiming(0.7, { duration: 100 }), 4, true),
							withTiming(0, { duration: 50 })
						);
						onPressCallback
							? onPressCallback({
									today: false,
									title: title,
									id: id,
									accessToken: accessToken,
									calendarId: calendarId,
									tags: tags,
									reps: reps,
									daysTill: daysTill,
									totalreps: totalreps,
									spacedRepId: spacedRepId,
									percentFinished: percentFinished,
									repsRemaining: repsRemaining,
							  })
							: null;
					}}
				>
					<View style={styles.metaContainer}>
						<View style={styles.titleContainer}>
							<Text style={styles.titleText}>{title}</Text>
						</View>
						<View style={styles.tagContainer}>
							<AntDesign name="tags" size={18} color="#D7D7D7" />
							<FlatList
								data={tags}
								horizontal
								renderItem={({ item }) => {
									return <Tags name={item} />;
								}}
								keyExtractor={(item) => item}
								showsHorizontalScrollIndicator={false}
							/>
						</View>
					</View>
					{!repsLeft ? (
						<View style={styles.counterHolder}>
							<View style={styles.counter}>
								{daysTill ? (
									daysTill == 1 ? (
										<Text style={styles.counterText}>In {daysTill} day</Text>
									) : (
										<Text style={styles.counterText}>In {daysTill} days</Text>
									)
								) : (
									<Text style={styles.counterText}>Today</Text>
								)}
							</View>
						</View>
					) : (
						<View style={styles.counterHolder}>
							<View style={styles.counter}>
								<Text style={styles.counterText}>
									{repsRemaining} reps left
								</Text>
							</View>
						</View>
					)}
				</Anim.View>
			</Swipeable>
		</GestureHandlerRootView>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#2B3748",
		flexDirection: "row",
		height: 85,
		borderRadius: 8,
		// marginTop: 10,
		// flex: 1,
	},
	leftAction: {
		flex: 1,
		backgroundColor: "#497AFC",
		justifyContent: "center",
	},
	metaContainer: {
		flex: 5,
		justifyContent: "space-evenly",
		paddingHorizontal: 20,
	},
	titleContainer: {},
	tagContainer: { flexDirection: "row", paddingVertical: 5 },
	counterHolder: {
		flex: 3,
		justifyContent: "center",
		alignItems: "center",
	},
	counter: {
		paddingHorizontal: 20,
		backgroundColor: "#00D34B",
		paddingVertical: 10,
		marginRight: 10,
		borderRadius: 10,
	},
	tag: {
		color: "#D7D7D7",
		marginHorizontal: 5,
		backgroundColor: "#445168",
		paddingHorizontal: 10,
		borderRadius: 5,
		textAlignVertical: "center",
		textAlign: "center",
	},
	counterText: {
		fontSize: 15,
		fontWeight: "bold",
		color: "black",
	},
	titleText: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#D7D7D7",
		// textAlign: "center",
	},
});

export default SpacedRepListItem;

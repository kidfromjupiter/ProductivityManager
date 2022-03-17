import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { getEventData } from "../../extras/GAuth";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

const Tags = ({ name }) => {
	return <Text style={styles.tag}>{name}</Text>;
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
	selectedId,
}) => {
	// const [tags, setTags] = useState([]);
	// useEffect(() => {
	// 	getEventData(accessToken, calendarId, id)
	// 		.then((e) => console.log(e.data))
	// 		.catch((e) => console.log(e.response));
	// }, [id]);
	// console.log(totalreps, reps);
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
		<Animated.View
			style={[styles.container, animatedStyle]}
			// entering={SlideInRight}
			onTouchEnd={() => {
				rotation.value = withSequence(
					withTiming(-1, { duration: 50 }),
					withRepeat(withTiming(0.5, { duration: 100 }), 4, true),
					withTiming(0, { duration: 50 })
				);
				// rotation.value = 10;
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
						<Text style={styles.counterText}>{repsRemaining} reps left</Text>
					</View>
				</View>
			)}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#2B3748",
		flexDirection: "row",
		height: 85,
		borderRadius: 10,
		marginTop: 10,
		// flex: 1,
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

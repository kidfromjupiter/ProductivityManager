import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, Text, Button, Touchable } from "react-native";
import { StyleSheet } from "react-native";
import Square from "../components/square";
import { Theme } from "../components/TopLevelContainer";
import { useSelector } from "react-redux";
import Timer from "../components/Counter";

function HomeScreen({ navigation }) {
	const backgroundColor = useContext(Theme);
	const isrunning = useSelector((state) => state.time.isRunning);
	return (
		<View style={[styles.rootContainer, { backgroundColor: backgroundColor }]}>
			<View style={styles.container}>
				<Square
					flex={5}
					text="Pomodoro"
					startColor="#9D50BB"
					endColor="#6E48AA"
					navigation={navigation}
				/>
				<Square
					flex={3}
					text="Timer"
					startColor="#00143D"
					endColor="#00257A"
					navigation={navigation}
				>
					{isrunning ? <Timer context="home" /> : null}
				</Square>
			</View>
			<View style={styles.container}>
				<View>
					<Square
						flex={1}
						text="Todo"
						startColor="#B993D6"
						endColor="#8CA6DB"
						navigation={navigation}
					/>
					<Square
						flex={1}
						text="Settings"
						startColor="#5BD5F0"
						endColor="#3a7bd5"
						navigation={navigation}
					/>
				</View>
				<Square
					flex={1}
					text="Stats"
					endColor="#ff5858"
					startColor="#D33E30"
					navigation={navigation}
				/>
			</View>
			<View style={styles.container}>
				<Square
					flex={1}
					text="Reminders"
					endColor="#00BFB6"
					startColor="#0055BF"
					navigation={navigation}
				/>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
	},
	rootContainer: {
		flex: 1,
		// backgroundColor: "#000000",
	},
});
export default HomeScreen;

import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, Text, Button, Touchable } from "react-native";
import { StyleSheet } from "react-native";
import Square from "../components/square";
import { useSelector } from "react-redux";
import Timer from "../components/Counter";
import MiniReminderView from "../components/MiniReminderView";

function HomeScreen({ navigation }) {
	const isrunning = useSelector((state) => state.time.isRunning);
	const [DialogBoxShow, setDialogBoxShow] = React.useState(false);
	return (
		<View style={[styles.rootContainer]}>
			<View style={styles.container}>
				<Square
					flex={5}
					text="Pomodoro"
					startColor="#9D50BB"
					endColor="#6E48AA"
					navigation={navigation}
					showTitle
				/>
				<Square
					flex={3}
					text="Timer"
					startColor="#00143D"
					endColor="#00257A"
					navigation={navigation}
				>
					<Timer context="home" timeSize={65} isDisabled />
				</Square>
			</View>
			<View style={styles.container}>
				<View>
					<Square
						flex={1}
						text="Settings"
						startColor="#5BD5F0"
						endColor="#3a7bd5"
						navigation={navigation}
						showTitle
					/>
				</View>
				<Square
					flex={1}
					text="Stats"
					endColor="#ff5858"
					startColor="#D33E30"
					navigation={navigation}
					showTitle
				/>
			</View>
			<View style={styles.container}>
				<Square
					flex={1}
					text="Reminders"
					endColor="#00BFB6"
					startColor="#0055BF"
					navigation={navigation}
					showTitle
					iconName="pluscircle"
				>
					<MiniReminderView />
				</Square>
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
		backgroundColor: "#191F2C",
	},
});
export default HomeScreen;

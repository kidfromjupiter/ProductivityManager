import React, { useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CountDown from "../components/Countdown";
import Timer from "../components/Counter";
import Loading from "../components/LottieLoading";
import MiniReminderView from "../components/MiniReminderView";
import QuickView, {
	QuickViewSub,
} from "../components/SpacedRep/HomeScreenQuickView";
import Square from "../components/square";
import dateParser from "../extras/dateparser";
import { getMostRecentEvent } from "../extras/calendar";
import { resetTimer, setTimer, startTimer } from "../redux/TimerSlice";
import ImprovedText from "../components/CustomReactComponent/ImprovedText";
import PomodoroQuickView from "../components/PomodoroQuickView";
import { GradientBackground } from "./Analytics/Today";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import { getRecentEvent } from "../extras/BACKEND";

// import Animated, { FadeInDown } from "react-native-reanimated";

function HomeScreen({ navigation }) {
	const fadeAnimValue = new Animated.Value(0);
	const timer = useSelector((state) => state.time);
	const color = useSelector((state) => state.colors);
	const accessToken = useSelector((state) => state.gauth.AuthToken);
	const idtoken = useSelector((state) => state.gauth.idtoken);
	const calID = useSelector((state) => state.gauth.calendarID);
	const [eventData, setEventData] = useState(null);
	const [showCountdown, setShowCountdown] = useState(false);
	const deadline = useSelector((state) => state.deadline.deadline);
	const initialTime = useSelector((state) => state.time.initialValue);
	const [welcomeText, setWelcomeText] = useState(getTimePrompt());
	const dispatch = useDispatch();

	const fadeAnim = {
		opacity: fadeAnimValue.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 1],
		}),
		transform: [
			{
				translateY: fadeAnimValue.interpolate({
					inputRange: [0, 1],
					outputRange: [40, 0],
				}),
			},
		],
	};

	function getTimePrompt() {
		const time = new Date();
		if (time.getHours() <= 12) {
			return "Morning";
		}
		if (time.getHours() >= 12 && time.getHours() <= 15) {
			return "Afternoon";
		}
		if (time.getHours() >= 15) {
			if (time.getHours() >= 23) {
				return "lord. Go to sleep";
			}
			return "Evening";
		}
	}

	function getEvent() {
		// getMostRecentEvent(accessToken, calID)
		// 	.then((e) => {
		// 		e.data.items.length > 0
		// 			? setEventData(e.data.items[0])
		// 			: setEventData("empty");
		// 	})
		// 	.catch((e) => setEventData("empty"));
		getRecentEvent(idtoken)
			.then((res) => {
				if (res.data.data) {
					setEventData(res.data.data);
				} else {
					setEventData("empty");
				}
			})
			.catch(() => setEventData("empty"));
	}

	const StartTimer = () => {
		if (timer.time !== 0) {
			dispatch(startTimer());
		}
	};
	const ResetTimer = () => {
		dispatch(resetTimer());
	};
	const SetTimer = (value) => {
		dispatch(setTimer(value));
	};

	useEffect(() => {
		setWelcomeText(getTimePrompt());
		getEvent();
	}, []);
	useEffect(() => {
		Animated.timing(fadeAnimValue, {
			toValue: 1,
			duration: 900,
			useNativeDriver: true,
		}).start();
		const interval = setTimeout(() => {
			setShowCountdown(true);
		}, 2700);
		return () => clearTimeout(interval);
	}, [deadline]);

	const delayMultipier = 10;

	const { minutes, seconds } = dateParser(timer.time);
	return (
		<View style={[styles.rootContainer, { backgroundColor: color.levelOne }]}>
			<Svg style={StyleSheet.absoluteFill}>
				<Defs>
					<RadialGradient
						id="grad"
						cx="50%"
						cy="-30%"
						gradientUnits="userSpaceOnUse"
					>
						<Stop offset={0} stopColor={color.levelFour} stopOpacity="0.4" />
						<Stop offset={1} stopColor={color.levelOne} stopOpacity="1" />
					</RadialGradient>
				</Defs>
				<Rect
					x="0"
					y="0"
					width={Dimensions.get("screen").width}
					height={Dimensions.get("screen").height}
					fill="url(#grad)"
				/>
			</Svg>
			{showCountdown && deadline != 0 ? (
				<CountDown />
			) : (
				<Animated.View
					style={[
						styles.section,
						styles.intro,
						{ backgroundColor: null },
						fadeAnim,
					]}
				>
					<ImprovedText
						style={styles.introText}
						backgroundColor={color.backgroundColor}
						text="Good"
					/>
					<ImprovedText
						style={styles.introText}
						backgroundColor={color.backgroundColor}
						text={welcomeText}
					/>
				</Animated.View>
			)}

			<View style={styles.container}>
				<Square
					enteringDelay={Math.random() * delayMultipier}
					flex={5}
					text="Pomodoro"
					startColor="#9D50BB"
					endColor="#6E48AA"
					navigation={navigation}
					showTitle
					customStyles={{
						backgroundColor: color.levelOne,
						overflow: "hidden",
					}}
					titleStyle={{ color: color.accentColor }}
				>
					<PomodoroQuickView />
					<GradientBackground />
				</Square>
				<Square
					enteringDelay={Math.random()}
					flex={3}
					text="Timer"
					startColor="#00143D"
					endColor="#00257A"
					navigation={navigation}
					customStyles={{ backgroundColor: color.levelOne, overflow: "hidden" }}
					titleStyle={{ color: color.accentColor }}
				>
					<Timer
						context="home"
						timeSize={55}
						isDisabled
						StartTimer={StartTimer}
						ResetTimer={ResetTimer}
						timer={timer}
						minutes={minutes}
						seconds={seconds}
						setTimer={SetTimer}
						initialTime={initialTime}
						backgroundColor={color.backgroundColor}
					/>
					<GradientBackground width={Dimensions.get("screen").width} />
				</Square>
			</View>
			<View style={styles.container}>
				<View>
					<Square
						enteringDelay={Math.random()}
						flex={1}
						text="Settings"
						startColor="#5BD5F0"
						endColor="#3a7bd5"
						navigation={navigation}
						showTitle
						customStyles={{
							backgroundColor: color.levelOne,
							overflow: "hidden",
						}}
						titleStyle={{ color: color.accentColor }}
					>
						<GradientBackground />
					</Square>
					<Square
						enteringDelay={Math.random()}
						flex={2}
						text="Analytics"
						startColor="#9D50BB"
						endColor="#6E48AA"
						navigation={navigation}
						showTitle
						customStyles={{
							backgroundColor: color.levelOne,
							overflow: "hidden",
						}}
						titleStyle={{ color: color.accentColor }}
					>
						<GradientBackground />
					</Square>
				</View>
				<Square
					enteringDelay={Math.random()}
					flex={1}
					text="Spaced Repetition"
					endColor="#ff5858"
					startColor="#D33E30"
					navigation={navigation}
					showTitle
					customStyles={{ backgroundColor: color.levelOne, overflow: "hidden" }}
					titleStyle={{ color: color.accentColor }}
				>
					<GradientBackground />
					{eventData && eventData != "empty" ? (
						<QuickView
							title={eventData.summary}
							startDate={eventData.start}
							repNumber={eventData.extendedProperties.private.repNumber}
							numberOfReps={eventData.extendedProperties.private.numberOfReps}
						/>
					) : eventData == "empty" ? (
						<QuickViewSub color={color} />
					) : (
						<Loading
							containerStyle={{ backgroundColor: null }}
							lottieStyle={{ height: 90, width: 90 }}
						/>
					)}
				</Square>
			</View>
			<View style={[styles.container, { flex: 4 }]}>
				<Square
					enteringDelay={Math.random()}
					flex={1}
					text="Reminders"
					endColor="#00BFB6"
					startColor="#0055BF"
					navigation={navigation}
					showTitle
					customStyles={{ backgroundColor: color.levelOne, overflow: "hidden" }}
					titleStyle={{ color: color.accentColor }}
					iconName="pluscircle"
				>
					<MiniReminderView navigation={navigation} />
					<GradientBackground width={Dimensions.get("screen").width} />
				</Square>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 3,
		flexDirection: "row",
	},
	rootContainer: {
		flex: 1,
		backgroundColor: "#191F2C",
	},
	intro: {
		height: 200,
		flex: 3,
		paddingHorizontal: 20,
		justifyContent: "center",
	},
	introText: {
		fontSize: 40,
		color: "white",
	},
});
export default HomeScreen;

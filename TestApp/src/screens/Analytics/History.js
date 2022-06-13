import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Button,
	Dimensions,
	Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import { GradientBackground } from "./Today";
import { Calendar, CalendarList } from "react-native-calendars";
import {
	color,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { FlatList } from "react-native-gesture-handler";
import Carousel from "react-native-snap-carousel";
import Svg, { LinearGradient, Defs, Rect, Stop } from "react-native-svg";
import Animated from "react-native-reanimated";

const History = ({ navigation }) => {
	const colors = useSelector((state) => state.colors);
	const [yearsIndex, setyearsIndex] = useState(new Date().getMonth());
	const [monthIndex, setmonthIndex] = useState(0);
	const [selectedDate, setselectedDate] = useState(new Date());
	const monthRef = useRef();
	const yearRef = useRef();
	const theme = {
		backgroundColor: "#ffffff",
		calendarBackground: colors.backgroundColor,
		textSectionTitleColor: "#b6c1cd",
		textSectionTitleDisabledColor: "#d9e1e8",
		selectedDayBackgroundColor: "#00adf5",
		selectedDayTextColor: "#ffffff",
		todayTextColor: "#00adf5",
		dayTextColor: "white",
		textDisabledColor: "white",
		dotColor: "#00adf5",
		selectedDotColor: "#ffffff",
		arrowColor: "orange",
		disabledArrowColor: "#d9e1e8",
		monthTextColor: colors.accentColor,
		indicatorColor: colors.accentColor,
		textDayFontWeight: "300",
		textMonthFontWeight: "bold",
		textDayHeaderFontWeight: "300",
		textDayFontSize: 16,
		textMonthFontSize: 16,
		textDayHeaderFontSize: 16,
	};
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	// useEffect(() => {
	// 	monthRef.current.scrollToIndex({ index: monthIndex });
	// 	// yearRef.current.scrollToIndex({ index: yearsIndex });
	// }, [monthRef]);

	const years = ["2021", "2022", "2023"];

	const renderMonths = ({ item, index }) => {
		return (
			<View style={[styles.dateHolder]}>
				<Text style={{ fontSize: 25, color: "white" }}>{item}</Text>
			</View>
		);
	};
	const renderYears = ({ item, index }) => {
		return (
			<View style={[styles.dateHolder]}>
				<Text style={{ fontSize: 25, color: "white" }}>{item}</Text>
			</View>
		);
	};

	return (
		<View
			style={[styles.container, { backgroundColor: colors.backgroundColor }]}
		>
			<Pressable
				style={[styles.datePicker, { backgroundColor: colors.levelOne }]}
			>
				<Svg
					height="95"
					width="70"
					// style={[StyleSheet.absoluteFill, { top: 0 }]}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						marginTop: 25,
						zIndex: 10,
					}}
				>
					<Defs>
						<LinearGradient id="grad1" x1="0" y1="0" x2="10%" y2="0">
							<Stop offset="0" stopColor={colors.levelOne} stopOpacity="0.8" />
							<Stop offset="1" stopColor={colors.levelOne} stopOpacity="0" />
						</LinearGradient>
					</Defs>
					<Rect x={0} y={0} height={1000} width={500} fill="url(#grad1)" />
				</Svg>
				<Svg
					height="95"
					width="70"
					// style={[StyleSheet.absoluteFill, { top: 0 }]}
					style={{
						position: "absolute",
						top: 0,
						right: 0,
						marginTop: 25,
						zIndex: 10,
					}}
				>
					<Defs>
						<LinearGradient id="grad1" x1="0" y1="0" x2="10%" y2="0">
							<Stop offset="1" stopColor={colors.levelOne} stopOpacity="0.8" />
							<Stop offset="0" stopColor={colors.levelOne} stopOpacity="0" />
						</LinearGradient>
					</Defs>
					<Rect x={0} y={0} height={1000} width={500} fill="url(#grad1)" />
				</Svg>
				<Carousel
					layout="default"
					enableMomentum
					loop
					data={years}
					itemWidth={Dimensions.get("screen").width / 2 - 10}
					sliderWidth={Dimensions.get("screen").width}
					renderItem={renderYears}
					onSnapToItem={(index) => {
						setyearsIndex(index);
					}}
				/>
				<View
					style={[
						// StyleSheet.absoluteFill,
						{
							height: 2,
							backgroundColor: colors.accentColor,
							// width: width.value,
							width: 100,
							borderRadius: 2,
						},
					]}
				></View>
				<Carousel
					layout="default"
					enableMomentum
					loop
					data={months}
					itemWidth={Dimensions.get("screen").width / 2 - 10}
					sliderWidth={Dimensions.get("screen").width}
					renderItem={renderMonths}
					centerContent
					onSnapToItem={(index) => {
						setmonthIndex(index);
					}}
					ref={monthRef}
				/>
			</Pressable>
			<View
				style={{
					justifyContent: "center",
					alignItems: "center",
					flex: 1,
					// height: (Dimensions.get("screen").height - 20) / 2,
				}}
			>
				<Calendar
					style={{
						// height: Dimensions.get("screen").height,
						width: Dimensions.get("screen").width,
					}}
					initialDate={new Date()}
					theme={theme}
					enableSwipeMonths={false}
					disableArrowLeft
					disableMonthChange
					disableArrowRight
					hideArrows
					hideExtraDays
				/>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		// justifyContent: "center",
	},
	datePicker: {
		paddingTop: 25,
		height: 120,
		justifyContent: "center",
		alignItems: "center",
		// backgroundColor: "red",
		// flex: 1,
	},
	dateHolder: {
		// height: 50,
		// padding: 1
		alignItems: "center",
		justifyContent: "center",
		width: Dimensions.get("screen").width / 2 - 10,
		// backgroundColor: "red",
	},
});

export default History;

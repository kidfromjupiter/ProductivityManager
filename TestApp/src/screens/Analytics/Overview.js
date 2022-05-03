import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { LineChart, StackedBarChart } from "react-native-chart-kit";
import { GradientBackground } from "./Today";
import Square from "../../components/square";
import StackedBar from "../../components/analytics/graphs/StackedBar";
import {
	getAllTime,
	getMonthly,
	getWeekly,
} from "../../extras/Analytics_backend";
import Heatmap from "../../components/analytics/graphs/Heatmap";
import AllTime from "../../components/analytics/AlltimeHolder";

const OverView = ({ navigation }) => {
	const colors = useSelector((state) => state.colors);
	const [analyticsData, setAnalyticsData] = useState(null);
	const idtoken = useSelector((state) => state.gauth.IdToken);
	const [stacked_data, setStackedData] = useState(null);
	const [monthly, setMonthly] = useState(null);
	const tracker = useSelector((state) => state.tracker);
	const [contribMap, setContribMap] = useState(null);
	const [alltime, setAllTime] = useState(null);

	useEffect(() => {
		currentDate = new Date();
		startDate = new Date(currentDate.getFullYear(), 0, 1);
		const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

		const weekNumber = Math.ceil((currentDate.getDay() + 1 + days) / 7);
		const month = new Date().getMonth() + 1;

		getWeekly(idtoken, weekNumber).then((res) => {
			setAnalyticsData(res.data.data);
		});
		getMonthly(idtoken, month).then((res) => {
			setMonthly(res.data.data);
		});
		getAllTime(idtoken).then((res) => {
			setAllTime(res.data);
		});
	}, [tracker.trackingData]);

	useEffect(() => {
		function processWeekly() {
			let chartdata = [];
			const labels = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
			const legend = ["Focus", "Break"];
			analyticsData.map((e) => {
				let day = [e.total_sessiontime, e.total_breaktime];
				chartdata.push(day);
			});
			if (chartdata.length < 7) {
				const length = 7 - chartdata.length;
				for (let i = 0; i < length; i++) {
					chartdata.push([0, 0]);
				}
			}
			return {
				labels: labels,
				legend: legend,
				data: chartdata,
				barColors: [colors.levelOne, colors.levelTwo],
			};
		}
		if (analyticsData) {
			const d = processWeekly();
			setStackedData(d);
		}
	}, [colors, analyticsData]);

	useEffect(() => {
		let contribmap = {};
		if (monthly) {
			monthly.map((e) => {
				contribmap[new Date(e.date).getDate()] = e.total_sessiontime;
			});
			setContribMap(contribmap);
		}
	}, [monthly]);

	const chartConfig = {
		backgroundGradientFrom: colors.accentColor,
		backgroundGradientFromOpacity: 0,
		backgroundGradientTo: colors.levelOne,
		backgroundGradientToOpacity: 0,
		color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
		strokeWidth: 2, // optional, default 3
		barPercentage: 0.75,
		useShadowColorFromDataset: false, // optional
		barRadius: 10,
	};
	return (
		<View
			style={[styles.container, { backgroundColor: colors.backgroundColor }]}
		>
			<View
				style={{
					flex: 1,
					marginBottom: 80,
					backgroundColor: colors.levelOne,
					marginHorizontal: 5,
					marginTop: 20,
					borderRadius: 20,
				}}
			>
				<View style={styles.subSection}>
					<Square
						flex={1}
						customStyles={{ overflow: "hidden" }}
						animationDisabled
					>
						<Text style={styles.titleText}>This week</Text>
						<View style={{ flex: 1, marginHorizontal: 10, overflow: "hidden" }}>
							{stacked_data ? (
								<StackedBar
									chartConfig={chartConfig}
									stacked_data={stacked_data}
								/>
							) : null}
						</View>
						<GradientBackground
							width={Dimensions.get("screen").width}
							cx={10}
						/>
					</Square>
				</View>
				<View style={styles.subSection}>
					<Square
						flex={1}
						customStyles={{ overflow: "hidden" }}
						animationDisabled
					>
						<Text style={styles.titleText}>This month</Text>
						<View style={{ flex: 1, marginHorizontal: 10 }}>
							{contribMap ? (
								<Heatmap data={contribMap} chartConfig={chartConfig} />
							) : null}
						</View>
						<GradientBackground
							width={Dimensions.get("screen").width}
							cx={10}
						/>
					</Square>
				</View>
				<View style={[styles.subSection, { maxHeight: 150 }]}>
					<Square
						flex={1}
						customStyles={{ overflow: "hidden" }}
						animationDisabled
					>
						<Text style={styles.titleText}>All time</Text>
						<View style={{ flex: 1, marginHorizontal: 10, overflow: "hidden" }}>
							{alltime ? (
								<AllTime
									st={alltime.total_sessiontime}
									bt={alltime.total_breaktime}
									at={alltime.total_apptime}
								/>
							) : null}
						</View>
						{/* <View style={}>

						</View> */}
						<GradientBackground
							width={Dimensions.get("screen").width}
							cx={10}
						/>
					</Square>
				</View>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		// alignItems: "center",
		justifyContent: "center",
	},
	titleText: {
		fontSize: 20,
		fontWeight: "bold",
		padding: 10,
		color: "white",
		zIndex: 10,
	},
	subText: {
		fontSize: 15,
		textAlign: "center",
		color: "grey",
	},
	subSection: {
		flex: 1,
		flexDirection: "row",
	},
});

export default OverView;

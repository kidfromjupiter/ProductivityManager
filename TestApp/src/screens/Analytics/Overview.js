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
import moment from "moment";
import Loading from "../../components/LottieLoading";
import {
	VictoryStack,
	VictoryBar,
	VictoryChart,
	VictoryLabel,
	VictoryLegend,
	VictoryAxis,
} from "victory-native";
import { ScrollView } from "react-native-gesture-handler";
import AnalyticsLoading from "../../components/analytics/AnalyticsLoading";
import AverageDaily from "../../components/analytics/DailyAverage";

const OverView = ({ navigation }) => {
	const colors = useSelector((state) => state.colors);
	const [analyticsData, setAnalyticsData] = useState(null);
	const idtoken = useSelector((state) => state.gauth.idtoken);
	const [stacked_data, setStackedData] = useState(null);
	const [monthly, setMonthly] = useState(null);
	const tracker = useSelector((state) => state.tracker);
	const [contribMap, setContribMap] = useState(null);
	const [alltime, setAllTime] = useState(null);

	useEffect(() => {
		const month = new Date().getMonth() + 1;
		const weekNumber = moment().format("W");
		getWeekly(idtoken, weekNumber).then((res) => {
			if (res.data.data) {
				const { breakdata, focusdata, focusavrg, breakavrg } = processWeekly(
					res.data.data
				);
				setStackedData({
					breakdata: breakdata,
					focusdata: focusdata,
					focusavrg: focusavrg,
					breakavrg: breakavrg,
				});
			}
		});
		getMonthly(idtoken, month).then((res) => {
			let contribmap = {};
			if (res.data.data) {
				res.data.data.map((e) => {
					contribmap[new Date(e.date).getDate()] = e.total_sessiontime;
				});
				setContribMap(contribmap);
			}
		});
		getAllTime(idtoken).then((res) => {
			setAllTime(res.data);
		});
	}, []);

	function processWeekly(analyticsData) {
		let focusdata = [];
		let breakdata = [];
		for (const obj of analyticsData) {
			const date = moment(obj.date).format("dddd");
			const st = Math.round(
				moment.duration(obj.total_sessiontime, "seconds").asMinutes()
			);
			const bt = Math.round(
				moment.duration(obj.total_breaktime, "seconds").asMinutes()
			);
			switch (date) {
				case "Monday":
					let f = { x: 1, y: st };
					let b = { x: 1, y: bt };
					focusdata.push(f);
					breakdata.push(b);
					break;
				case "Tuesday":
					f = { x: 2, y: st };
					b = { x: 2, y: bt };
					focusdata.push(f);
					breakdata.push(b);
					break;
				case "Wednesday":
					f = { x: 3, y: st };
					b = { x: 3, y: bt };
					focusdata.push(f);
					breakdata.push(b);
					break;
				case "Thursday":
					f = { x: 4, y: st };
					b = { x: 4, y: bt };
					focusdata.push(f);
					breakdata.push(b);
					break;
				case "Friday":
					f = { x: 5, y: st };
					b = { x: 5, y: bt };
					focusdata.push(f);
					breakdata.push(b);
					break;
				case "Saturday":
					f = { x: 6, y: st };
					b = { x: 6, y: bt };
					focusdata.push(f);
					breakdata.push(b);
					break;
				case "Sunday":
					f = { x: 7, y: st };
					b = { x: 7, y: bt };
					focusdata.push(f);
					breakdata.push(b);
					break;

				default:
					break;
			}
		}
		//y = breakdata
		// m= focusdata
		let m = [
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
			{ x: 4, y: 0 },
			{ x: 5, y: 0 },
			{ x: 6, y: 0 },
			{ x: 7, y: 0 },
		];
		let y = [
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
			{ x: 4, y: 0 },
			{ x: 5, y: 0 },
			{ x: 6, y: 0 },
			{ x: 7, y: 0 },
		];
		let sumbreak = 0;
		let sumfocus = 0;

		for (const u of m) {
			for (const l of focusdata) {
				if (l.x == u.x) {
					m[m.indexOf(u)] = l;
					sumfocus += l.y;
				}
			}
		}
		for (const u of y) {
			for (const l of breakdata) {
				if (l.x == u.x) {
					y[y.indexOf(u)] = l;
					sumbreak += l.y;
				}
			}
		}
		return {
			breakdata: y,
			focusdata: m,
			breakavrg: Math.round(sumbreak / Object.keys(analyticsData).length),
			focusavrg: Math.round(sumfocus / Object.keys(analyticsData).length),
		};
	}

	if (!stacked_data || !contribMap || !alltime) {
		return <AnalyticsLoading />;
	}
	function format(e) {
		{
			switch (e) {
				case 1:
					return "Mon";
				case 2:
					return "Tue";
				case 3:
					return "Wed";
				case 4:
					return "Thu";
				case 5:
					return "Fri";
				case 6:
					return "Sat";
				case 7:
					return "Sun";
				default:
					break;
			}
		}
	}
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
					marginTop: 10,
					borderRadius: 20,
					overflow: "hidden",
				}}
			>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.subSection}>
						<Square
							flex={1}
							customStyles={{ overflow: "hidden" }}
							animationDisabled
						>
							<Text style={styles.titleText}>This week</Text>
							<View
								style={{ flex: 1, marginHorizontal: 10, overflow: "hidden" }}
							>
								{stacked_data ? (
									<VictoryChart
										height={250}
										width={Dimensions.get("screen").width - 40}
										animate={{
											onEnter: {
												duration: 500,
											},
										}}
									>
										<VictoryAxis
											style={{
												axis: { stroke: colors.levelFour },
												tickLabels: {
													fill: colors.levelFour,
													fontWeight: "bold",
												},
											}}
											// offsetY={30}
											tickFormat={format}
										/>
										<VictoryAxis
											dependentAxis
											style={{
												axis: { stroke: colors.levelFour },
												tickLabels: {
													fill: colors.levelFour,
													fontWeight: "bold",
												},
											}}
											offsetX={30}
											padding={{ right: 10 }}
										/>
										<VictoryLegend
											data={[
												{
													name: "Break",
													symbol: { fill: colors.levelTwo },
													labels: { fill: "white" },
												},
												{
													name: "Focus",
													symbol: { fill: colors.accentColor },
													labels: { fill: "white" },
												},
											]}
											orientation="horizontal"
										/>
										<VictoryStack
											colorScale={[colors.accentColor, colors.levelTwo]}
										>
											<VictoryBar
												data={stacked_data.focusdata}
												cornerRadius={{ bottom: 2, top: 2 }}
												barRatio={1.1}
												// alignment="start"
											/>
											<VictoryBar
												data={stacked_data.breakdata}
												cornerRadius={{ top: 4 }}
												barRatio={1.1}
												// alignment="start"
											/>
										</VictoryStack>
									</VictoryChart>
								) : null}
							</View>
							<AverageDaily
								focustime={stacked_data.focusavrg}
								breaktime={stacked_data.breakavrg}
							/>
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
							<Text style={[styles.titleText]}>This month</Text>
							<View style={{ marginHorizontal: 10 }}>
								{contribMap ? <Heatmap data={contribMap} /> : null}
							</View>
							<GradientBackground
								width={Dimensions.get("screen").width}
								// height={700}
								cx={10}
							/>
						</Square>
					</View>
					<View style={[styles.subSection, { height: 150 }]}>
						<Square
							flex={1}
							customStyles={{ overflow: "hidden" }}
							animationDisabled
						>
							<Text style={styles.titleText}>All time</Text>
							<View
								style={{ flex: 1, marginHorizontal: 10, overflow: "hidden" }}
							>
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
				</ScrollView>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 25,
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

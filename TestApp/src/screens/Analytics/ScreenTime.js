import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import Loading from "../../components/LottieLoading";
import Square from "../../components/square";
import { getDaily } from "../../extras/Analytics_backend";
import { TimeHolder } from "./Today";
import { GradientBackground } from "./Today";
import moment from "moment";
import { VictoryLabel, VictoryBar } from "victory-native";
import AnalyticsLoading from "../../components/analytics/AnalyticsLoading";
const ScreenTime = ({ navigation }) => {
	const colors = useSelector((state) => state.colors);
	const [AnalyticsData, setAnalyticsData] = useState(null);
	const [VictoryData, setVictoryData] = useState(null);
	const idtoken = useSelector((state) => state.gauth.idtoken);
	const [meta, setmeta] = useState(null);
	const maxvalue = useRef(0);
	useEffect(() => {
		const today = new Date().toISOString().substring(0, 10);
		getDaily(idtoken, today).then((res) => {
			setAnalyticsData(res.data.data);
		});
	}, []);

	useEffect(() => {
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		let d = [];
		if (AnalyticsData) {
			let max = 0;
			let i = 0;
			Object.keys(AnalyticsData).forEach((element) => {
				if (/(screentime)\w+/g.exec(element) && AnalyticsData[element] > 0) {
					const m = {
						x: i,
						y: AnalyticsData[element],
						label: capitalizeFirstLetter(
							element.substring(element.indexOf("_") + 1)
						),
					};
					d.push(m);
					i++;
				}
				if (AnalyticsData[element] > max) {
					max = AnalyticsData[element];
				}
			});
			maxvalue.current = max;
			setVictoryData(d);
		}
	}, [AnalyticsData]);

	if (!AnalyticsData || !VictoryData) {
		return <AnalyticsLoading />;
	}
	return (
		<View
			style={[styles.container, { backgroundColor: colors.backgroundColor }]}
		>
			<View
				style={{
					height: 200,
					borderRadius: 20,
					margin: 5,
					overflow: "hidden",
				}}
			>
				<View
					onLayout={(e) => setmeta(e.nativeEvent.layout)}
					style={{ flex: 1, marginRight: 10 }}
				>
					{meta && VictoryData.length > 0 ? (
						<VictoryBar
							horizontal
							data={VictoryData}
							height={meta.height}
							style={{ data: { fill: colors.accentColor } }}
							barRatio={1.2}
							width={meta.width}
							cornerRadius={{ top: 8, bottom: 5 }}
							labelComponent={
								<VictoryLabel
									style={{ fill: "white", fontSize: 15, fontWeight: "bold" }}
								/>
							}
						/>
					) : (
						// </VictoryChart>
						// <>
						// 	<VictoryChart
						// 		height={meta.height}
						// 		animate={{ onEnter: { duration: 100 } }}
						// 		width={meta.width}
						// 	>
						// 		<VictoryPie
						// 			data={VictoryData}
						// 			innerRadius={({ datum }) => datum.y * 100}
						// 			radius={0}
						// 			colorScale="cool"
						// 		/>
						// 		<VictoryLegend
						// 			colorScale={"cool"}
						// 			data={VictoryData}
						// 			// style={{ font }}
						// 		/>
						// 	</VictoryChart>
						// </>
						<View
							style={{
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text style={{ color: "white", fontSize: 18 }}>
								Nothing here yet
							</Text>
						</View>
					)}
				</View>
			</View>
			<View
				style={{
					marginBottom: 0,
					flex: 1,
					backgroundColor: colors.levelOne,
					borderRadius: 20,
					margin: 5,
				}}
			>
				<View style={{ flex: 1 }}>
					<View style={styles.subSection}>
						<Square flex={1} customStyles={{ overflow: "hidden" }}>
							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
									flex: 1,
								}}
							>
								<TimeHolder
									text="Home"
									hours={moment
										.duration(AnalyticsData.screentime_home, "seconds")
										.hours()}
									minutes={moment
										.duration(AnalyticsData.screentime_home, "seconds")
										.minutes()}
								/>
							</View>
							<GradientBackground />
						</Square>
						<Square flex={1} customStyles={{ overflow: "hidden" }}>
							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
									flex: 1,
								}}
							>
								<TimeHolder
									text="Settings"
									hours={moment
										.duration(AnalyticsData.screentime_settings, "seconds")
										.hours()}
									minutes={moment
										.duration(AnalyticsData.screentime_settings, "seconds")
										.minutes()}
								/>
							</View>
							<GradientBackground />
						</Square>
					</View>
					<View style={styles.subSection}>
						<Square flex={1} customStyles={{ overflow: "hidden" }}>
							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
									flex: 1,
								}}
							>
								<TimeHolder
									text="Reminders"
									hours={moment
										.duration(AnalyticsData.screentime_reminders, "seconds")
										.hours()}
									minutes={moment
										.duration(AnalyticsData.screentime_reminders, "seconds")
										.minutes()}
								/>
							</View>
							<GradientBackground />
						</Square>
						<Square flex={1} customStyles={{ overflow: "hidden" }}>
							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
									flex: 1,
								}}
							>
								<TimeHolder
									text="Timer"
									hours={moment
										.duration(AnalyticsData.screentime_timer, "seconds")
										.hours()}
									minutes={moment
										.duration(AnalyticsData.screentime_timer, "seconds")
										.minutes()}
								/>
							</View>
							<GradientBackground />
						</Square>
					</View>
					<View style={styles.subSection}>
						<Square flex={1} customStyles={{ overflow: "hidden" }}>
							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
									flex: 1,
								}}
							>
								<TimeHolder
									text="Spaced repetition"
									hours={moment
										.duration(AnalyticsData.screentime_spacedrep, "seconds")
										.hours()}
									minutes={moment
										.duration(AnalyticsData.screentime_spacedrep, "seconds")
										.minutes()}
								/>
							</View>
							<GradientBackground />
						</Square>
						<Square flex={1} customStyles={{ overflow: "hidden" }}>
							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
									flex: 1,
								}}
							>
								<TimeHolder
									text="Total"
									hours={moment
										.duration(AnalyticsData.totaltime, "seconds")
										.hours()}
									minutes={moment
										.duration(AnalyticsData.totaltime, "seconds")
										.minutes()}
								/>
							</View>
							<GradientBackground />
						</Square>
					</View>
				</View>
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingBottom: 80,
	},
	subSection: {
		flex: 1,
		flexDirection: "row",
	},
	carouselItem: {
		height: Dimensions.get("screen").height - 200,
		width: Dimensions.get("screen").width,
		borderRadius: 20,
	},
	accountInfo: {
		minHeight: 150,
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
	},
	titleText: {
		fontSize: 20,
		fontWeight: "bold",
		padding: 10,
		color: "white",
		zIndex: 10,
		textAlign: "center",
	},
	subText: {
		fontSize: 15,
		textAlign: "center",
		color: "grey",
	},
});
export default ScreenTime;

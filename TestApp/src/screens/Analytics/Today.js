import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	Button,
	Dimensions,
	Image,
	FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Square from "../../components/square";
import { Grid, PieChart } from "react-native-svg-charts";
import { getTextColor } from "../../components/CustomReactComponent/ImprovedText";
import Svg, {
	Defs,
	Stop,
	RadialGradient,
	Rect,
	Text as Tx,
} from "react-native-svg";
import { LineChart, StackedBarChart } from "react-native-chart-kit";
import { default as _ANALYTICS } from "../../extras/classes/AnalyticsClass";
import {
	getAllTime,
	getDaily,
	post_analytics_data,
} from "../../extras/Analytics_backend";
import Loading from "../../components/LottieLoading";
import moment from "moment";
import StackedBar from "../../components/analytics/graphs/StackedBar";
import { resetTracker } from "../../redux/TrackerSlice";
import {
	VictoryPie,
	VictoryLabel,
	VictoryBar,
	VictoryChart,
	VictoryLegend,
	VictoryAxis,
} from "victory-native";
import AnalyticsLoading from "../../components/analytics/AnalyticsLoading";
const CIRCLE_MAX = 100;

const TimeHolder = ({ hours, minutes, text }) => {
	return (
		<View
			style={{
				justifyContent: "center",
				alignItems: "center",
				flex: 1,
			}}
		>
			{hours > 0 ? (
				<Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
					{Math.round(hours)} hr
				</Text>
			) : null}
			<Text style={{ fontSize: 30, fontWeight: "bold", color: "white" }}>
				{Math.round(minutes)} min
			</Text>
			{text ? <Text style={styles.subText}>{text}</Text> : null}
		</View>
	);
};

const GradientBackground = ({ width, cx, height, cy, accent, background }) => {
	const colors = useSelector((state) => state.colors);
	return (
		<Svg
			height="1000"
			width="500"
			style={{ position: "absolute", zIndex: -10 }}
		>
			<Defs>
				<RadialGradient
					id="grad"
					cx={`${cx ? cx : 100}`}
					cy={`${cy ? cy : 0}`}
					rx="130"
					ry="130"
					gradientUnits="userSpaceOnUse"
				>
					<Stop
						offset="0"
						stopColor={accent ? accent : colors.accentColor}
						stopOpacity="0.15"
					/>
					<Stop
						offset="1"
						stopColor={background ? background : colors.backgroundColor}
						stopOpacity="1"
					/>
				</RadialGradient>
			</Defs>
			<Rect
				width={`${width ? width : 300}`}
				height={`${height ? height : 500}`}
				fill="url(#grad)"
			/>
		</Svg>
	);
};

const Labels = ({ slices }) => {
	return slices.map((slice, index) => {
		const { labelCentroid, pieCentroid, data } = slice;
		return (
			<Tx
				key={index}
				x={pieCentroid[0]}
				y={pieCentroid[1]}
				fill={"white"}
				textAnchor={"middle"}
				// alignmentBaseline={"middle"}
				fontSize={17}
				stroke={0}
			>
				{data.key}
			</Tx>
		);
	});
};

const Today = ({}) => {
	const gauth = useSelector((state) => state.gauth);
	const colors = useSelector((state) => state.colors);
	const tracker = useSelector((state) => state.tracker);
	const idtoken = useSelector((state) => state.gauth.idtoken);
	const finishedpomodoros = useSelector(
		(state) => state.pomodoro.finishedPomodoros
	);
	const [analyticsData, setAnalyticsData] = useState(null);
	const [meta, setMeta] = useState(null);

	const dispatch = useDispatch();

	useEffect(() => {
		function createAnalyticsPayload() {
			objlist = [];
			const today = new Date().toISOString().substring(0, 10);
			for (const key of Object.keys(tracker.trackerObjectList)) {
				const a = new _ANALYTICS(
					tracker.trackerObjectList[key].breakTimeTot,
					tracker.trackerObjectList[key].sessionTimeTot,
					tracker.trackerObjectList[key].screenTime,
					tracker.trackerObjectList[key].trackingData,
					key,
					finishedpomodoros
				);
				objlist.push(a);
			}
			objlist.push(
				new _ANALYTICS(
					tracker.breakTimeTot,
					tracker.sessionTimeTot,
					tracker.screenTime,
					tracker.trackingData,
					today,
					finishedpomodoros
				)
			);
			return objlist;
		}
		const today = new Date().toISOString().substring(0, 10);
		console.log("ran effect");
		post_analytics_data(idtoken, createAnalyticsPayload()).then(() => {
			dispatch(resetTracker());
			console.log("Analytics data sent");
			getDaily(idtoken, today).then((res) => {
				console.log("Analytics data received");
				setAnalyticsData(res.data.data);
			});
		});
	}, []);

	const victoryData = [
		{
			x: 1,
			y: analyticsData?.total_sessiontime
				? analyticsData?.total_sessiontime
				: 1,
			label: "Focus",
		},
		{
			x: 2,
			y: analyticsData?.total_breaktime ? analyticsData?.total_breaktime : 1,
			label: "Break",
		},
	];

	if (!analyticsData) {
		return <AnalyticsLoading />;
	}

	return (
		<View
			style={[styles.container, { backgroundColor: colors.backgroundColor }]}
		>
			<Svg style={StyleSheet.absoluteFill}>
				<Defs>
					<RadialGradient
						id="grad"
						cx="50%"
						cy="-30%"
						gradientUnits="userSpaceOnUse"
					>
						<Stop offset={0} stopColor={colors.levelFour} stopOpacity="0.4" />
						<Stop
							offset={1}
							stopColor={colors.backgroundColor}
							stopOpacity="1"
						/>
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
			<View style={styles.accountInfo}>
				<View>
					<Image
						style={styles.profile_pic}
						source={{ uri: gauth.profile_pic }}
					/>
				</View>
				<View>
					<Text
						style={[
							styles.accountText,
							styles.name,
							{
								maxWidth: Dimensions.get("window").width - 75,
								color: getTextColor(colors.backgroundColor),
							},
						]}
						numberOfLines={1}
						ellipsizeMode="tail"
					>
						Hey, {gauth.name}!
					</Text>
					<Text
						style={[
							styles.accountText,
							{ color: getTextColor(colors.backgroundColor) },
						]}
					>
						{gauth.email}
					</Text>
				</View>
			</View>
			<Text style={[styles.titleText, { fontSize: 25, textAlign: "center" }]}>
				Today
			</Text>
			<View
				style={{
					marginBottom: 0,
					flex: 1,
					backgroundColor: colors.levelOne,
					borderRadius: 20,
					margin: 5,
					overflow: "hidden",
				}}
			>
				<View style={{ flex: 1 }}>
					<View style={styles.subSection}>
						<View
							style={{
								flex: 1,
								overflow: "hidden",
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 20,
								zIndex: 10,
								margin: 10,
								// elevation: 6,
							}}
						>
							<View
								style={{
									flex: 1,
								}}
								onLayout={(e) => {
									setMeta(e.nativeEvent.layout);
								}}
							>
								{meta ? (
									<VictoryPie
										data={victoryData}
										colorScale="qualitative"
										height={meta.height}
										labelComponent={
											<VictoryLabel style={{ fill: "white", fontSize: 18 }} />
										}
										innerRadius={200}
										labelRadius={35}
										radius={0}
									/>
								) : null}
							</View>
						</View>
						<Square flex={1} customStyles={{ overflow: "hidden" }}>
							<TimeHolder
								hours={moment
									.duration(analyticsData.total_sessiontime, "seconds")
									.hours()}
								minutes={moment
									.duration(analyticsData.total_sessiontime, "seconds")
									.minutes()}
								text="Total Time Focused"
							/>
							<GradientBackground />
						</Square>
					</View>
					<View style={styles.subSection}>
						<Square flex={1} customStyles={{ overflow: "hidden" }}>
							<TimeHolder
								hours={moment
									.duration(analyticsData.total_breaktime, "seconds")
									.hours()}
								minutes={moment
									.duration(analyticsData.total_breaktime, "seconds")
									.minutes()}
								text="Total Break Time"
							/>
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
								<Text
									style={{ fontSize: 80, fontWeight: "bold", color: "white" }}
								>
									{analyticsData?.finishedpomodoros}
								</Text>
								<Text style={styles.subText}>Pomodoros</Text>
								<Text style={styles.subText}>Completed</Text>
							</View>
							<GradientBackground />
						</Square>
					</View>
					<View style={styles.subSection}>
						<Square flex={1} customStyles={{ overflow: "hidden" }}>
							<TimeHolder
								hours={moment
									.duration(analyticsData.totaltime, "seconds")
									.hours()}
								minutes={moment
									.duration(analyticsData.totaltime, "seconds")
									.minutes()}
								text="Total time on app"
							/>
							<GradientBackground />
						</Square>
						<Square flex={1} customStyles={{ overflow: "hidden" }}>
							<Text style={styles.titleText}>Investment</Text>
							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
									flex: 1,
								}}
							>
								<Text
									style={{ fontSize: 40, fontWeight: "bold", color: "white" }}
								>
									18.71$
								</Text>
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
		justifyContent: "center",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
	},
	profile_pic: {
		width: 60,
		height: 60,
		borderRadius: 15,
		marginRight: 15,
	},
	accountText: {
		padding: 2,
		color: "white",
		fontSize: 12,
	},
	name: {
		fontSize: 25,
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
});
export { TimeHolder };
export default Today;
export { GradientBackground };

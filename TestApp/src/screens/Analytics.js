import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import {
	LineChart,
	BarChart,
	PieChart,
	ProgressChart,
	ContributionGraph,
	StackedBarChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";

const Analytics = ({ navigation }) => {
	const data = {
		labels: ["Test1", "Test2"],
		legend: ["L1", "L2", "L3"],
		data: [
			[60, 60, 60],
			[30, 30, 60],
		],
		barColors: ["#2FAD14", "#DB3A3A", "#a4b0be"],
	};
	const chartConfig = {
		// backgroundGradientFrom: "#1E2923",
		// backgroundGradientFromOpacity: 0,
		// backgroundGradientTo: "#08130D",
		// backgroundGradientToOpacity: 0.5,
		color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
		strokeWidth: 2, // optional, default 3
		barPercentage: 0.6,
		useShadowColorFromDataset: false, // optional
	};
	return (
		<View style={styles.container}>
			<Text>Analytics Screen</Text>
			<StackedBarChart
				// style={graphStyle}
				data={data}
				width={300}
				height={220}
				chartConfig={chartConfig}
			/>
			{/* <View>
				<Text>Bezier Line Chart</Text>
				<LineChart
					data={{
						labels: ["January", "February", "March", "April", "May", "June"],
						datasets: [
							{
								data: [
									Math.random() * 100,
									Math.random() * 100,
									Math.random() * 100,
									Math.random() * 100,
									Math.random() * 100,
									Math.random() * 100,
								],
							},
						],
					}}
					width={Dimensions.get("window").width} // from react-native
					height={220}
					yAxisLabel="$"
					yAxisSuffix="k"
					yAxisInterval={1} // optional, defaults to 1
					chartConfig={{
						backgroundColor: "#e26a00",
						backgroundGradientFrom: "#fb8c00",
						backgroundGradientTo: "#ffa726",
						decimalPlaces: 2, // optional, defaults to 2dp
						color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						style: {
							borderRadius: 16,
						},
						propsForDots: {
							r: "6",
							strokeWidth: "2",
							stroke: "#ffa726",
						},
					}}
					bezier
					style={{
						marginVertical: 8,
						borderRadius: 16,
					}}
				/>
			</View> */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default Analytics;

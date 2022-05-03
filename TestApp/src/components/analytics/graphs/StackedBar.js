import React, { useEffect, useState } from "react";
import { Dimensions, View, Text } from "react-native";
import { StackedBarChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";
import ImprovedText from "../../CustomReactComponent/ImprovedText";
import Loading from "../../LottieLoading";

export default function StackedBar({ chartConfig, stacked_data }) {
	const colors = useSelector((state) => state.colors);
	return (
		<>
			{stacked_data &&
			stacked_data.data.toString() !=
				[
					[0, 0],
					[0, 0],
					[0, 0],
					[0, 0],
					[0, 0],
					[0, 0],
					[0, 0],
				].toString() ? (
				<StackedBarChart
					data={stacked_data}
					width={Dimensions.get("screen").width - 10}
					height={170}
					chartConfig={chartConfig}
				/>
			) : (
				<View
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
				>
					<ImprovedText
						backgroundColor={colors.backgroundColor}
						text={"Looks like you haven't done anything this week"}
					/>
				</View>
			)}
		</>
	);
}

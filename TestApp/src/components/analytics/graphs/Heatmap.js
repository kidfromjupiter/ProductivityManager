import React, { useEffect, useRef, useState } from "react";
import { ContributionGraph } from "react-native-chart-kit";
import { View, Text, Dimensions, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { getTextColor } from "../../CustomReactComponent/ImprovedText";

export default function Heatmap({ data, chartConfig }) {
	const colors = useSelector((state) => state.colors);
	const [gen, setGen] = useState([]);
	const [layout, setLayout] = useState(null);
	const [cleanedValue, setCleanedValue] = useState({});
	const maxValue = useRef(Math.max(...Object.values(data)));

	function reduce(value) {
		if (maxValue.current == 0) {
			return 0.15;
		}
		const p = value / maxValue.current;
		var multiplier = Math.pow(10, 1 || 0);
		return Math.round(p * multiplier) / multiplier;
		// console.log(p);
	}

	const theme = {
		backgroundColor: "#ffffff",
		// calendarBackground: "transparent",
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
	function generatelist() {
		let l = [];
		for (let index = 0; index < 31; index++) {
			if (data[index + 1] >= 0) {
				l.push({
					date: index + 1,
					day: () => {
						switch (index % 7) {
							case 0:
								return "Mon";
							case 1:
								return "Tue";
							case 2:
								return "Wed";
							case 3:
								return "Thu";
							case 4:
								return "Fri";
							case 5:
								return "Sat";
							case 6:
								return "Sun";
							default:
								break;
						}
					},
					color: getColor(colors.levelThree, reduce(data[index])),
				});
			} else {
				l.push({
					date: index + 1,
					day: () => {
						switch (index % 7) {
							case 0:
								return "Mon";
							case 1:
								return "Tue";
							case 2:
								return "Wed";
							case 3:
								return "Thu";
							case 4:
								return "Fri";
							case 5:
								return "Sat";
							case 6:
								return "Sun";
							default:
								break;
						}
					},
					color: getColor(colors.levelThree, 0.05),
				});
			}
		}
		return l;
	}
	function hexToRGB(hex) {
		let r = 0,
			g = 0,
			b = 0;

		// 3 digits
		if (hex.length == 4) {
			r = "0x" + hex[1] + hex[1];
			g = "0x" + hex[2] + hex[2];
			b = "0x" + hex[3] + hex[3];

			// 6 digits
		} else if (hex.length == 7) {
			r = "0x" + hex[1] + hex[2];
			g = "0x" + hex[3] + hex[4];
			b = "0x" + hex[5] + hex[6];
		}

		return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
	}

	function getColor(d, l) {
		const c = hexToRGB(d);
		c[3] = l;

		return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
	}

	useEffect(() => {
		setGen(generatelist());
	}, [data]);

	return (
		<>
			<View
				style={{ flex: 1, justifyContent: "center" }}
				onLayout={(e) => {
					setLayout(e.nativeEvent.layout);
				}}
			>
				{layout ? (
					<FlatList
						data={gen}
						numColumns={7}
						keyExtractor={(item) => item.date}
						renderItem={({ item }) => {
							return (
								<View
									style={{
										height: (layout.height - 50) / 5,
										width: (layout.width - 50) / 7,
										backgroundColor: item.color,
										margin: 3,
										marginHorizontal: 3,
										borderRadius: 5,
										justifyContent: "center",
										alignItems: "center",
										// opacity: item.opacity,
										// opacity: 1,
									}}
								>
									<Text
										style={{
											fontSize: 17,
											fontWeight: "bold",
											color: "white",
										}}
									>
										{item.date}
										{/* {data[item.date] >= 0 ? reduce(data[item.date]) : 0.1} */}
									</Text>
								</View>
							);
						}}
					/>
				) : null}
			</View>
		</>
	);
}

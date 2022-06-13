import React, { useEffect, useRef, useState } from "react";
import { ContributionGraph } from "react-native-chart-kit";
import { View, Text, Dimensions, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { getTextColor } from "../../CustomReactComponent/ImprovedText";

function Heatmap({ data, chartConfig }) {
	const colors = useSelector((state) => state.colors);
	const [gen, setGen] = useState([]);
	const maxValue = useRef(Math.max(...Object.values(data)));

	function reduce(value) {
		if (maxValue.current == 0) {
			return 0.15;
		}
		const p = value / maxValue.current;

		return p;
	}

	const theme = {
		// backgroundColor: "transparent",
		calendarBackground: "transparent",
		textSectionTitleColor: "#b6c1cd",
		textSectionTitleDisabledColor: "#d9e1e8",
		selectedDayBackgroundColor: "#00adf5",
		selectedDayTextColor: "white",
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
		"stylesheet.calendar.header": {
			monthText: {
				display: "none",
			},
		},
	};
	function generatelist() {
		let l = {};
		for (const o of Object.keys(data)) {
			let d = new Date();
			d.setDate(o);
			const mins = moment.duration(data[o], "seconds").asMinutes();
			const s = d.toISOString().substring(0, 10);
			l[s] = {
				selectedColor: getColor(colors.levelThree, reduce(data[o])),
				selected: true,
			};
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
		<View
			style={{
				flex: 1,
				borderRadius: 10,
				overflow: "hidden",
				// backgroundColor: "white",
			}}
		>
			<Calendar
				theme={theme}
				hideExtraDays
				disableMonthChange
				hideArrows
				markedDates={gen}
				firstDay={1}
			/>
		</View>
	);
}
export default Heatmap;

import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

function rgb2hsv(value) {
	let r = value[0] / 255;
	let g = value[1] / 255;
	let b = value[2] / 255;
	let v = Math.max(r, g, b),
		c = v - Math.min(r, g, b);
	let h =
		c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);
	return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
}

function getTextColorValue(value) {
	const v = value[2];
	if (v < 0.5) {
		return "#ffffff";
	}
	return "#000000";
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

function getTextColor(value) {
	d = getTextColorValue(rgb2hsv(hexToRGB(value ? value : "#000000")));
	return d;
}

export default function ImprovedText({ backgroundColor, text, style }) {
	const [textColor, setTextColor] = useState(
		getTextColorValue(
			rgb2hsv(hexToRGB(backgroundColor ? backgroundColor : "#000000"))
		)
	);
	const colors = useSelector((state) => state.colors);

	useEffect(() => {
		setTextColor(
			getTextColorValue(
				rgb2hsv(hexToRGB(backgroundColor ? backgroundColor : "#000000"))
			)
		);
	}, [colors]);

	return (
		<>
			<Text style={[style, { color: textColor }]}>{text}</Text>
		</>
	);
}

export { getTextColor };

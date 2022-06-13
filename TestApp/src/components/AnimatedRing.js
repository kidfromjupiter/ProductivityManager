import React, { useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import Svg, { Circle } from "react-native-svg";
import Animated, {
	useAnimatedProps,
	useSharedValue,
	withTiming,
	withRepeat,
	interpolate,
	withSpring,
	FadeIn,
	FadeOut,
	Layout,
} from "react-native-reanimated";

const CIRCLE_LENGTH = 800;
const R = CIRCLE_LENGTH / (2 * Math.PI);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const AnimatedRing = ({ children, flex, animated, ringColor, onLayout }) => {
	const [Meta, setMeta] = useState(null);
	const l = useSharedValue(0);

	function circle() {
		l.value = withTiming(1, { duration: 1000 }, () => {
			l.value = -1;
		});
	}
	animated ? circle() : null;
	const animatedProp = useAnimatedProps(() => {
		return {
			strokeDashoffset: CIRCLE_LENGTH * l.value,
		};
	});

	return (
		<Animated.View
			style={[styles.childrenContainer, { flex: flex, zIndex: 1 }]}
			onLayout={(e) => {
				onLayout(e);
				setMeta(e.nativeEvent.layout);
			}}
			entering={FadeIn}
			exiting={FadeOut}
			layout={Layout}
		>
			<View style={[styles.circle]}>{children}</View>
			{Meta ? (
				<Svg
					style={{
						position: "absolute",
					}}
				>
					<AnimatedCircle
						cx={Meta.width / 2}
						cy={Meta.height / 2}
						r={R}
						stroke={ringColor}
						strokeWidth={5}
						strokeDasharray={CIRCLE_LENGTH}
						animatedProps={animatedProp}
						strokeLinecap={"round"}
						transform={`rotate(-90 ${Meta.width / 2} ${Meta.height / 2})`}
					/>
				</Svg>
			) : null}
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	circle: {
		width: 250,
		height: 250,
		// borderRadius: 250 / 2,
		// borderWidth: 4,
		// justifyContent: "center",
		// alignItems: "center",
	},
	innerCircle: {
		position: "absolute",
	},
	childrenContainer: {
		flex: 2,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 100,
	},
});

export default React.memo(AnimatedRing);

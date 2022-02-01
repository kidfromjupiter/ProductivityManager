import React, { useRef } from "react";
import {
	StyleSheet,
	View,
	Text,
	Animated,
	Pressable,
	LayoutAnimation,
} from "react-native";

const PressableAnimated = Animated.createAnimatedComponent(Pressable);

const Square = ({
	text,
	flex,
	showTitle,
	enableLongPress,
	children,
	navigation,
	customStyles,
	scaleDown,
	scaleUp,
	holdToExpand,
	expandSize,
	expanded,
	ParentTouchEndCallback,
}) => {
	// const [expanded, setExpanded] = React.useState(false);
	const animatedButtonScale = new Animated.Value(1);

	const onTouchStart = () => {
		Animated.timing(animatedButtonScale, {
			toValue: scaleDown ? scaleDown : 0.8,
			useNativeDriver: true,
			duration: 200,
		}).start(() => onTouchEnd());
	};

	const onTouchEnd = () => {
		Animated.timing(animatedButtonScale, {
			toValue: scaleUp ? scaleUp : 1,
			useNativeDriver: true,
			duration: 200,
		}).start(() =>
			navigation ? navigation.navigate(text) : TouchEndCallback()
		);
	};

	const TouchEndCallback = () => {
		return;
	};

	const animatedScaleStyle = {
		transform: [{ scale: animatedButtonScale }],
	};

	return (
		<PressableAnimated
			// colors={[props.startColor, props.endColor]}
			delayLongPress={250}
			style={[
				styles.container,
				customStyles,
				holdToExpand && expandSize && expanded ? expandSize : null,
				{ flex: flex },
				animatedScaleStyle,
			]}
			onTouchStart={() => {
				onTouchStart();
			}}
			onTouchEnd={() => {
				onTouchEnd();
			}}
			onLongPress={
				enableLongPress
					? () => {
							LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

							ParentTouchEndCallback();
					  }
					: null
			}
		>
			<View style={styles.childrenContainer}>
				{showTitle ? <Text style={styles.text}>{text}</Text> : null}
				{children}
			</View>
		</PressableAnimated>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		borderRadius: 20,
		margin: 6,
		backgroundColor: "#2B3748",
		shadowColor: "black",
		shadowRadius: 2,
		shadowOffset: {
			width: 2,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 8,

		// backgroundColor: "white",
	},
	rootContainer: {
		flex: 1,
	},
	text: {
		fontSize: 20,
		color: "#00D34B",
		fontWeight: "bold",
		padding: 12,
	},
	textHolder: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	childrenContainer: {
		flex: 1,
		flexDirection: "column",
	},
});

export default Square;

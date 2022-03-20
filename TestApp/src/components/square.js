import React from 'react';
import {
	Animated,
	LayoutAnimation,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';

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
	holdToExpand,
	expandSize,
	expanded,
	ParentHoldCallback,
	touchEndCallback,
	titleStyle,
}) => {
	const animatedButtonScale = new Animated.Value(0);

	const onTouchStart = () => {
		Animated.timing(animatedButtonScale, {
			toValue: 10,
			useNativeDriver: true,
			duration: 300,
		}).start(() => animatedButtonScale.setValue(0));
	};

	const animatedScaleStyle = {
		transform: [
			{
				scale: animatedButtonScale.interpolate({
					inputRange: [0, 5, 10],
					outputRange: [1, scaleDown ? scaleDown : 0.9, 1],
				}),
			},
		],
	};

	return (
		<PressableAnimated
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
				touchEndCallback ?
					touchEndCallback() :
					navigation ?
						navigation.navigate(text) :
						null;
			}}
			onLongPress={
				enableLongPress ?
					() => {
						LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

						ParentHoldCallback();
					  } :
					null
			}
		>
			<View style={styles.childrenContainer}>
				{showTitle ? (
					<Text style={[styles.text, titleStyle]}>{text}</Text>
				) : null}
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
		backgroundColor: '#2B3748',
		shadowColor: 'black',
		shadowRadius: 2,
		shadowOffset: {
			width: 2,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 8,
	},
	rootContainer: {
		flex: 1,
	},
	text: {
		fontSize: 20,
		color: '#00D34B',
		fontWeight: 'bold',
		padding: 12,
	},
	textHolder: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	childrenContainer: {
		flex: 1,
		flexDirection: 'column',
	},
});

export default Square;

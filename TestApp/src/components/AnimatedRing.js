import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

const AnimatedRing = ({ children, flex, animated, ringColor }) => {
	const animateValue = new Animated.Value(0);
	const colors = useSelector((state) => state.colors);
	// const ringColor = colors.accentColor;
	const fadeOutScaleUp = () => {
		Animated.timing(animateValue, {
			toValue: 1,
			duration: 1000,
			useNativeDriver: true,
		}).start(() => {
			animateValue.setValue(0);
		});
	};
	const animationStyles = {
		opacity: animateValue.interpolate({
			inputRange: [0, 1],
			outputRange: [1, 0],
		}),
		transform: [
			{
				scale: animateValue.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 2],
				}),
			},
		],
	};
	animated ? fadeOutScaleUp() : null;
	return (
		<View style={[styles.childrenContainer, { flex: flex }]}>
			<View
				style={[
					styles.circle,
					{
						borderColor: ringColor,
						backgroundColor: colors.backgroundColor,
					},
				]}
			>
				{children}
				<Animated.View
					style={[
						styles.circle,
						styles.innerCircle,
						animationStyles,
						{
							borderColor: ringColor,
							backgroundColor: colors.backgroundColor,
						},
					]}
				></Animated.View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	circle: {
		width: 250,
		height: 250,
		borderRadius: 250 / 2,
		borderWidth: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
	innerCircle: {
		position: 'absolute',
	},
	childrenContainer: {
		flex: 2,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default React.memo(AnimatedRing);

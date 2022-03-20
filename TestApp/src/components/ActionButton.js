import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import {
	Animated, Pressable,
	StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';


const PressableAnimated = Animated.createAnimatedComponent(Pressable);

const ActionButton = ({ text, icon, onPressOut }) => {
	const colors = useSelector((state) => state.colors);
	const animatedScale = new Animated.Value(1);

	const onTouchStart = () => {
		Animated.timing(animatedScale, {
			toValue: 0.8,
			useNativeDriver: true,
			duration: 100,
		}).start();
	};

	const onTouchEnd = () => {
		Animated.timing(animatedScale, {
			toValue: 1,
			useNativeDriver: true,
			duration: 100,
		}).start(() => onPressOut());
		// add();
	};

	const animatedScaleStyle = {
		transform: [{ scale: animatedScale }],
	};

	return (
		<PressableAnimated
			style={[
				styles.actionbutton,
				animatedScaleStyle,
				{ backgroundColor: colors.accentColor },
			]}
			onPressIn={() => {
				onTouchStart();
			}}
			onPressOut={() => {
				onTouchEnd();
				// add();
			}}
		>
			{icon ? icon : <AntDesign name="plus" size={30} color="white" />}
		</PressableAnimated>
	);
};

const styles = StyleSheet.create({
	actionbutton: {
		position: 'absolute',
		zIndex: 1000,
		bottom: 20,
		right: 20,
		backgroundColor: '#ffc484',
		width: 70,
		height: 70,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 40,
	},
});
export default ActionButton;

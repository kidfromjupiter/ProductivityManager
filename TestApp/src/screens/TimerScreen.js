import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BottomToast from '../components/BottomToast';
import Timer from '../components/Counter';
import dateParser from '../extras/dateparser';
import { resetTimer, setTimer, startTimer } from '../redux/TimerSlice';

const TimerScreen = () => {
	const running = useSelector((state) => state.time.isRunning);
	const colors = useSelector((state) => state.colors);
	const timer = useSelector((state) => state.time);

	const dispatch = useDispatch();

	const StartTimer = () => {
		if (timer.time !== 0) {
			dispatch(startTimer());
		}
	};
	const ResetTimer = () => {
		dispatch(resetTimer());
	};
	const SetTimer = (value) => {
		dispatch(setTimer(value));
	};

	const { minutes, seconds } = dateParser(timer.time);

	return (
		<View
			style={[
				styles.rootContainer,
				{ backgroundColor: colors.backgroundColor },
			]}
		>
			<Timer
				context="timer"
				timeSize={150}
				StartTimer={StartTimer}
				ResetTimer={ResetTimer}
				dispatch={dispatch}
				timer={timer}
				minutes={minutes}
				seconds={seconds}
				setTimer={SetTimer}
			/>
			{!running ? (
				<BottomToast text="Tap to toggle timer on/off. Hold to reset" />
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
	},
});
export default TimerScreen;

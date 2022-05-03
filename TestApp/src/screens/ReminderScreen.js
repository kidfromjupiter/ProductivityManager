import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import {
	LayoutAnimation,
	StyleSheet,
	View,
	Text,
	Dimensions,
	ScrollView,
	TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ActionButton from "../components/ActionButton";
import DialogBox from "../components/DialogBox";
import ReminderList from "../components/ReminderList";
import { ReminderClass } from "../extras/classes/ReminderClass";
import {
	addReminder,
	batchAdd,
	addCategory as adc,
	setEditMode,
} from "../redux/ReminderSlice";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal";
import CustomButton from "../components/SpacedRep/CustomButton";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
	withSequence,
} from "react-native-reanimated";
import { createAnimatableComponent } from "react-native-animatable";
import ImprovedText, {
	getTextColor,
} from "../components/CustomReactComponent/ImprovedText";

const Tab = createMaterialTopTabNavigator();
const AnimatedIcon = createAnimatableComponent(AntDesign);

export const ReminderScreen = ({ navigation }) => {
	const dispatch = useDispatch();
	const colors = useSelector((state) => state.colors);
	const [DialogBoxShow, setDialogBoxShow] = React.useState({
		visible: false,
		category: null,
	});
	const [categoryModal, setCategoryModal] = useState(false);
	const editMode = useSelector((state) => state.reminders.editmode);
	const rotation = useSharedValue(0);
	const add = (category) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setDialogBoxShow({ visible: true, category: category });
	};
	const submit = (text, description) => {
		const reminder = new ReminderClass(
			text,
			description,
			DialogBoxShow.category
		);
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		dispatch(
			addReminder({ category: DialogBoxShow.category, reminder: reminder })
		);
		setDialogBoxShow({ visible: false, category: null });
	};

	const addCategory = (text) => {
		dispatch(adc({ categoryName: text }));
	};

	const screenOptions = ({ route }) => ({
		tabBarIcon: ({ focused, color, size }) => {
			let iconName;

			if (route.name === "CompletedReminders") {
				iconName = focused
					? "checkmark-done-circle"
					: "checkmark-done-circle-outline";
			} else if (route.name === "OngoingReminders") {
				iconName = focused ? "list-circle" : "list-circle-outline";
			}

			return <Ionicons name={iconName} size={25} color={color} />;
		},
		tabBarActiveTintColor: colors.accentColor,
		tabBarInactiveTintColor: "gray",
		tabBarIndicatorStyle: { backgroundColor: colors.accentColor },
		tabBarStyle: { backgroundColor: colors.levelOne },
		tabBarShowIcon: false,
		tabBarLabelStyle: { fontSize: 15, fontWeight: "bold" },
	});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotate: `${rotation.value}deg`,
				},
			],
		};
	});

	useEffect(() => {
		rotation.value = withSequence(
			withTiming(-10, { duration: 100 }),
			withRepeat(withTiming(5, { duration: 150 }), -1, true),
			withTiming(0, { duration: 200 })
		);
	}, [editMode]);

	return (
		<View
			style={[styles.container, { backgroundColor: colors.backgroundColor }]}
		>
			<View
				style={[
					{
						backgroundColor: editMode ? "red" : colors.levelOne,
					},
					styles.header,
				]}
			>
				<ImprovedText
					style={[styles.headerText]}
					text={editMode ? "Edit Reminders" : "Reminders"}
					backgroundColor={editMode ? "#ff0000" : colors.levelOne}
				/>
				<View
					style={{
						flex: 1,
						justifyContent: "flex-end",
						alignItems: "center",

						flexDirection: "row",
					}}
				>
					<Animated.View
						style={
							editMode ? animatedStyle : { transform: [{ rotate: "0deg" }] }
						}
					>
						<AntDesign
							name={"edit"}
							size={29}
							color={editMode ? "white" : getTextColor(colors.levelOne)}
							onPress={() => dispatch(setEditMode())}
							style={[{ paddingHorizontal: 20 }]}
						/>
					</Animated.View>
					<AntDesign
						name={"plus"}
						size={29}
						color={editMode ? "white" : getTextColor(colors.levelOne)}
						onPress={() => setCategoryModal(true)}
					/>
				</View>
			</View>

			<Tab.Navigator screenOptions={screenOptions}>
				<Tab.Screen
					component={ReminderList}
					name="OngoingReminders"
					options={({ route }) => {
						route.params = {
							type: "ongoing",
							actionButton: "true",
							add: add,
						};
						return {
							tabBarShowLabel: true,
							tabBarLabel: "Ongoing",
						};
					}}
				/>
				<Tab.Screen
					component={ReminderList}
					name="CompletedReminders"
					options={({ route }) => {
						route.params = {
							type: "completed",
						};
						return {
							tabBarShowLabel: true,
							tabBarLabel: "Completed",
						};
					}}
				/>
			</Tab.Navigator>

			<Modal
				isVisible={DialogBoxShow.visible}
				backdropColor="black"
				backdropOpacity={0.5}
			>
				<DialogBox
					onCancel={setDialogBoxShow}
					onSubmit={submit}
					isDescription
					color={colors}
				/>
			</Modal>
			<Modal
				isVisible={categoryModal}
				backdropColor="black"
				backdropOpacity={0.5}
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<TextInputModal
					colors={colors}
					title={"Make a category"}
					callback={(value) => {
						addCategory(value);
						setCategoryModal(false);
					}}
					cancelCallback={() => setCategoryModal(false)}
				/>
			</Modal>
			{/* ) : null} */}
		</View>
	);
};

const TextInputModal = ({ colors, title, callback, cancelCallback }) => {
	const [text, setText] = useState("");
	return (
		<View style={[styles.modalContainer, { backgroundColor: colors.levelTwo }]}>
			<View>
				<Text style={styles.titleText}>{title}</Text>
			</View>
			<View style={styles.inputHolder}>
				<TextInput
					style={{
						padding: 10,
						borderBottomColor: "grey",
						borderBottomWidth: 2,
						backgroundColor: colors.levelThree,
						color: "white",
					}}
					placeholder="Category Name"
					onChangeText={(text) => setText(text)}
					placeholderTextColor={"grey"}
				/>
			</View>
			<View style={styles.buttonHolder}>
				<CustomButton
					callback={cancelCallback}
					text="Cancel"
					color="#FC3030"
					textColorLight={"white"}
					customStyles={{ padding: 10, margin: 0 }}
				/>
				<CustomButton
					callback={() => {
						callback(text);
					}}
					text="Confirm"
					color="#00C300"
					textColorLight={"white"}
					customStyles={{ padding: 10, margin: 0 }}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headerText: {
		fontSize: 30,
		fontWeight: "bold",
		color: "white",
	},
	header: {
		width: Dimensions.get("screen").width,
		height: 75,
		alignItems: "center",
		padding: 15,

		flexDirection: "row",
		paddingTop: 25,
	},
	buttonHolder: {
		// maxHeight: 80,
		height: 45,
		// overflow: "hidden",
		flexDirection: "row",
	},
	modalContainer: {
		width: 300,
		backgroundColor: "white",
		borderRadius: 10,
		padding: 5,
	},
	titleText: {
		fontSize: 20,
		padding: 20,
		paddingBottom: 0,
		fontWeight: "bold",
		color: "white",
	},
	inputHolder: {
		// backgroundColor: "white",
		margin: 10,
		marginVertical: 20,
		borderRadius: 10,
		overflow: "hidden",
	},
});

export default ReminderScreen;

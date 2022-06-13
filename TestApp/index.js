import "react-native-gesture-handler";
import { registerRootComponent } from "expo";

import notifee from "@notifee/react-native";

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// notifee.registerForegroundService((notification) => {
// 	return new Promise(() => {
// 		// Long running task...
// 	});
// });

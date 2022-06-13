import notifee, { AndroidColor } from "@notifee/react-native";

const channelId = await notifee.createChannel({
	id: "default",
	name: "Default Channel",
});
notifee.displayNotification({
	title: "Foreground service",
	body: "This notification will exist for the lifetime of the service runner",
	android: {
		channelId: channelId,
		asForegroundService: true,
		color: AndroidColor.RED,
		colorized: true,
	},
});

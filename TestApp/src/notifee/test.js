import notifee from "@notifee/react-native";

async function Notify(title, body) {
	// Create a channel
	const channelId = await notifee.createChannel({
		id: "default",
		name: "Default Channel",
	});

	// Display a notification
	await notifee.displayNotification({
		id: "timerFinished",
		title: title,
		body: body,
		android: {
			channelId,
			actions: [
				{
					title: "Snooze",
					pressAction: {
						id: "snooze",
					},
				},
			],
		},
	});
}

export default Notify;

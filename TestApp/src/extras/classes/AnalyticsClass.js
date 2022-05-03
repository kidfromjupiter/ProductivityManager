export default class Analytics {
	constructor(
		total_breaktime,
		total_sessiontime,
		screentime,
		trackingData,
		date,
		finishedpomodoros
	) {
		this.total_breaktime = total_breaktime;
		this.total_sessiontime = total_sessiontime;
		this.screentime_home = screentime.Home;
		this.screentime_reminders = screentime.Reminders;
		this.screentime_spacedrep = screentime.SpacedRep;
		this.screentime_timer = screentime.Timer;
		this.screentime_settings = screentime.Settings;
		this.trackingData = trackingData;
		this.date = date;
		this.finishedpomodoros = finishedpomodoros;
	}
}

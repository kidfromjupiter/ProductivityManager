import axios from "axios";
import { store } from "../redux/store";
import { refreshAccessToken } from "./AuthHandler";

axios.defaults.baseURL = "https://www.googleapis.com/calendar/v3";

axios.interceptors.response.use(null, function (error) {
	if (error.response.status == 403) {
		//retrying after too many requests
		return axios(error.config);
	} else if (error.response.status == 401) {
		if (store.getState().gauth.isSignedIn) {
			console.log("running this");
			const authState = refreshAccessToken();
			authState.then((e) => {
				error.config.headers.Authorization = "Bearer " + e.accessToken;
				return axios(error.config);
			});
		}
		return Promise.reject(error);
	} else {
		return Promise.reject(error);
	}
});
async function addEvent(accesstoken, eventJSON, calendarID) {
	axios.defaults.headers.common["Authorization"] = "Bearer " + accesstoken;
	return await axios({
		method: "POST",
		url: "/calendars/" + calendarID + "/events/",
		data: eventJSON,
	});
}
async function getEvents(accesstoken, id) {
	axios.defaults.headers.common["Authorization"] = "Bearer " + accesstoken;

	return await axios({
		method: "GET",
		url: "/calendars/" + id + "/events/",
	});
}

async function deleteEvent(accesstoken, id, calId) {
	axios.defaults.headers.common["Authorization"] = "Bearer " + accesstoken;

	return await axios({
		method: "DELETE",
		url: "/calendars/" + calId + "/events/" + id,
	});
}

async function deleteCalendar(accesstoken, calId) {
	axios.defaults.headers.common["Authorization"] = "Bearer " + accesstoken;

	return await axios({
		method: "DELETE",
		url: "/calendars/" + calId,
	});
}

async function addCalendar(accesstoken) {
	axios.defaults.headers.common["Authorization"] = "Bearer " + accesstoken;

	return await axios({
		method: "POST",
		url: "/calendars",
		data: {
			summary: "Spaced Repetition",
		},
	});
}
async function getEventData(accesstoken, calId, eventId) {
	axios.defaults.headers.common["Authorization"] = "Bearer " + accesstoken;
	return await axios({
		method: "GET",
		url: "/calendars/" + calId + "/events/" + eventId,
	});
}

async function editEvent(accesstoken, calId, eventId, data) {
	axios.defaults.headers.common["Authorization"] = "Bearer " + accesstoken;
	return await axios({
		method: "PUT",
		url: "/calendars/" + calId + "/events/" + eventId,
		data: data,
	});
}

async function getMostRecentEvent(accesstoken, calId) {
	axios.defaults.headers.common["Authorization"] = "Bearer " + accesstoken;
	return await axios({
		method: "GET",
		url: "/calendars/" + calId + "/events",
		params: {
			orderBy: "startTime",
			maxResults: 1,
			singleEvents: true,
		},
	});
}

async function filterEvents(accesstoken, calId, spacedRepId) {
	axios.defaults.headers.common["Authorization"] = "Bearer " + accesstoken;
	return await axios({
		method: "GET",
		url: "/calendars/" + calId + "/events/",
		params: {
			privateExtendedProperty: spacedRepId,
		},
	});
}

async function listCalendars(accesstoken) {
	axios.defaults.headers.common["Authorization"] = "Bearer " + accesstoken;

	return await axios({
		method: "GET",
		url: "/users/me/calendarList",
	});
}

export {
	getEvents,
	addEvent,
	listCalendars,
	addCalendar,
	getEventData,
	deleteEvent,
	filterEvents,
	deleteCalendar,
	getMostRecentEvent,
};

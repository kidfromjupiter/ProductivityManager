import axios from "axios";
import { refreshAccessToken } from "./AuthHandler";
import { store } from "../redux/store";

const Backend = axios.create({
	baseURL: "https://get-it-done22.herokuapp.com/api",
	// baseURL: "http://192.168.146.196:8000/api",
});

export function errorHander(error) {
	if (!error.response) {
		//probably a post error
		store.dispatch(_SET_error({ type: "network", message: error.message }));
		return Promise.reject(error);
	}
	if (error.response.status == 403) {
		return axios(error.config);
	} else if (error.response.status == 401) {
		// console.log(error.config);
		refreshAccessToken();
		const accessToken = store.getState().gauth.AuthToken;
		const idtoken = store.getState().gauth.idtoken;
		error.config.headers.Authorization = accessToken;
		error.config.headers.idtoken = idtoken;
		return axios(error.config);
	} else if (error.response.status == 405) {
		const idtoken = store.getState().gauth.idtoken;
		createUser(idtoken);
	} else {
		return Promise.reject(error);
	}
}

export function requestInterceptor(config) {
	const idtoken = store.getState().gauth.idtoken;
	config.headers.idtoken = idtoken;
}

Backend.interceptors.response.use(null, errorHander);

// Backend.interceptors.request.use(requestInterceptor);

async function createUser(idtoken) {
	Backend.defaults.headers.common["idtoken"] = idtoken;
	return await Backend({
		method: "POST",
		url: "/users/",
	});
}

async function updateUserData(idtoken, data) {
	Backend.defaults.headers.common["idtoken"] = idtoken;
	Backend.defaults.headers.common["Content-Type"] = "application/json";
	return await Backend({
		method: "PATCH",
		url: "/users/",
		data: data,
	});
}

async function grabData(idtoken) {
	Backend.defaults.headers.common["idtoken"] = idtoken;
	return await Backend({
		method: "GET",
		url: "/users/",
	});
}

async function getCalId(accessToken, idtoken) {
	Backend.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
	Backend.defaults.headers.common["idtoken"] = idtoken;

	return await Backend({
		method: "POST",
		url: "/spacedrep/",
	});
}
async function getCalendars(accessToken, idtoken) {
	Backend.defaults.headers.common["Authorization"] = accessToken;
	Backend.defaults.headers.common["idtoken"] = idtoken;

	return await Backend({
		method: "GET",
		url: "/spacedrep/calendar/",
	});
}

async function createCalendar(accesstoken, idtoken, summary) {
	Backend.defaults.headers.common["Authorization"] = accesstoken;
	Backend.defaults.headers.common["idtoken"] = idtoken;

	return await Backend({
		method: "POST",
		url: "/spacedrep/calendar/",
		data: {
			summary: summary,
		},
	});
}

async function addEvent(accesstoken, idtoken, data) {
	Backend.defaults.headers.common["Authorization"] = accesstoken;
	Backend.defaults.headers.common["idtoken"] = idtoken;

	return await Backend({
		method: "POST",
		url: "/spacedrep/events/",
		data: data,
	});
}

async function getAllEvents(accesstoken, idtoken, calid) {
	Backend.defaults.headers.common["Authorization"] = accesstoken;
	Backend.defaults.headers.common["idtoken"] = idtoken;
	Backend.defaults.headers.common["calid"] = calid;

	return await Backend({
		method: "GET",
		url: "/spacedrep/events/",
	});
}
async function deleteEvent(accesstoken, idtoken, calid, eventid) {
	// console.log(accesstoken, idtoken, calid, eventid);
	Backend.defaults.headers.common["Authorization"] = accesstoken;
	Backend.defaults.headers.common["idtoken"] = idtoken;
	Backend.defaults.headers.common["calid"] = calid;
	Backend.defaults.headers.common["eventid"] = eventid;

	return await Backend({
		method: "DELETE",
		url: "/spacedrep/events/",
	});
}

async function getAllEventCollections(accesstoken, idtoken, calid) {
	Backend.defaults.headers.common["Authorization"] = accesstoken;
	Backend.defaults.headers.common["idtoken"] = idtoken;
	Backend.defaults.headers.common["calid"] = calid;

	return await Backend({
		method: "GET",
		url: "/spacedrep/eventcollection/",
	});
}

async function getRecentEvent(idtoken) {
	Backend.defaults.headers.common["idtoken"] = idtoken;
	return await Backend({
		method: "GET",
		url: "/spacedrep/events/upcoming/",
	});
}

async function search(accesstoken, idtoken, calid, query) {
	Backend.defaults.headers.common["Authorization"] = accesstoken;
	Backend.defaults.headers.common["idtoken"] = idtoken;
	Backend.defaults.headers.common["calid"] = calid;

	return await Backend({
		method: "GET",
		url: "/spacedrep/eventcollection/search/" + query + "/",
	});
}

export {
	grabData,
	createUser,
	updateUserData,
	getCalId,
	getCalendars,
	createCalendar,
	addEvent,
	getAllEvents,
	deleteEvent,
	getAllEventCollections,
	getRecentEvent,
	search,
};

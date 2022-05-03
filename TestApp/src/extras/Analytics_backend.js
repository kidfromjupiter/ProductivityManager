import axios from "axios";
import { refreshAccessToken } from "./AuthHandler";
// import { errorHander } from "./BACKEND";
import { store } from "../redux/store";

const ANALYTICS = axios.create({
	// baseURL: "https://get-it-done22.herokuapp.com/api/analytics",
	baseURL: "http://192.168.146.196:8000/api/analytics",
});

function errorHander(error) {
	if (error.response.status == 401) {
		refreshAccessToken();
		const accessToken = store.getState().gauth.AuthToken;
		const idtoken = store.getState().gauth.IdToken;
		error.config.headers.Authorization = accessToken;
		error.config.headers.idtoken = idtoken;
		return axios(error.config);
	} else {
		return Promise.reject(error);
	}
}

ANALYTICS.interceptors.response.use(null, (error) => errorHander(error));

function post_analytics_data(idtoken, data) {
	ANALYTICS.defaults.headers.common["idtoken"] = idtoken;
	return ANALYTICS({
		url: "/",
		method: "POST",
		data: data,
	});
}

function getDaily(idtoken, date) {
	ANALYTICS.defaults.headers.common["idtoken"] = idtoken;
	return ANALYTICS({
		method: "GET",
		url: `/daily/${date}`,
	});
}

async function getWeekly(idtoken, weeknum) {
	ANALYTICS.defaults.headers.common["idtoken"] = idtoken;
	return await ANALYTICS({
		method: "GET",
		url: `/week/${weeknum}`,
	});
}

async function getMonthly(idtoken, month) {
	ANALYTICS.defaults.headers.common["idtoken"] = idtoken;
	return await ANALYTICS({
		method: "GET",
		url: `/month/${month}`,
	});
}
async function getAllTime(idtoken) {
	ANALYTICS.defaults.headers.common["idtoken"] = idtoken;
	return await ANALYTICS({
		method: "GET",
		url: `/alltime/`,
	});
}

export { post_analytics_data, getDaily, getWeekly, getMonthly, getAllTime };

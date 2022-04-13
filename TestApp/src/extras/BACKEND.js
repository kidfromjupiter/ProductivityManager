import axios from "axios";
import { refreshAccessToken } from "./AuthHandler";
import { store } from "../redux/store";

const Backend = axios.create({
	baseURL: "https://get-it-done22.herokuapp.com/api",
});

Backend.interceptors.response.use(null, function (error) {
	if (error.response.status == 403) {
		return axios(error.config);
	} else if (error.response.status == 401) {
		// console.log(error.config);
		refreshAccessToken();
		const accessToken = store.getState().gauth.AuthToken;
		const idtoken = store.getState().gauth.IdToken;
		error.config.headers.Authorization = "Bearer " + accessToken;
		error.config.headers.IDToken = idtoken;
		return axios(error.config);
	} else if (error.response.status == 500) {
		return createUser(error.config.headers.Token);
	} else {
		return Promise.reject(error);
	}
});

async function createUser(idToken) {
	Backend.defaults.headers.common["Token"] = idToken;
	return await Backend({
		method: "POST",
		url: "/users/",
	});
}

async function updateUserData(idToken, data) {
	Backend.defaults.headers.common["Token"] = idToken;
	Backend.defaults.headers.common["Content-Type"] = "application/json";
	return await Backend({
		method: "PATCH",
		url: "/users/",
		data: data,
	});
}

async function grabData(idToken) {
	Backend.defaults.headers.common["Token"] = idToken;
	return await Backend({
		method: "GET",
		url: "/users/",
	});
}

async function getCalId(accessToken, idToken) {
	Backend.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
	Backend.defaults.headers.common["IDToken"] = idToken;

	return await Backend({
		method: "POST",
		url: "/spacedrep/",
	});
}

// async function getCalId(idToken,accessToken) {
// 	Backend.defaults.headers.common["IDToken"] = idToken;
// 	Backend.defaults.headers.common["Authorization"] = accessToken;

// 	return await Backend({

// 	})
// }
export { grabData, createUser, updateUserData, getCalId };

import axios from "axios";
import cookies from "next-cookies";
import { getCookie } from "cookies-next";
//https://stackoverflow.com/questions/69494662/x-auth-token-vs-x-access-token-vs-authorization-in-jwt

export default function (url: string, token: string) {
	if (token) {
		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		return axios
			.get(url)
			.then((res) => res.data)
			.catch((e) => {
				delete axios.defaults.headers.common["Authorization"];
				throw e;
			});
	}
}

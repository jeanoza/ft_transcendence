import axios from "axios";
//https://stackoverflow.com/questions/69494662/x-auth-token-vs-x-access-token-vs-authorization-in-jwt

export default function (url: string, token: string) {
	let accessToken = localStorage.getItem("accessToken");
	if (accessToken) {
		axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
		return axios
			.get(url)
			.then((res) => res.data)
			.catch((e) => {
				localStorage.removeItem("accessToken");
				delete axios.defaults.headers.common["Authorization"];
				throw e;
			});
	}
}

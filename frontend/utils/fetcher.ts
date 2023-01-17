import axios from "axios";

//https://stackoverflow.com/questions/69494662/x-auth-token-vs-x-access-token-vs-authorization-in-jwt

export default function (url: string) {
	let access_token = localStorage.getItem("access_token");
	if (access_token) {
		axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
		return axios
			.get(url)
			.then((res) => res.data)
			.catch((e) => {
				localStorage.removeItem("access_token");
				delete axios.defaults.headers.common["Authorization"];
				throw e;
			});
	}
}

import axios from "axios";
//https://stackoverflow.com/questions/69494662/x-auth-token-vs-x-access-token-vs-authorization-in-jwt

export default async function (url: string) {
	//axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	return axios
		.get(url)
		.then((res) => res.data)
		.catch((e) => {
			delete axios.defaults.headers.common["Authorization"];
			//console.error("fetcher:", e.message);
		});
}

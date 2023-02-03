import axios from "axios";
//https://stackoverflow.com/questions/69494662/x-auth-token-vs-x-access-token-vs-authorization-in-jwt

export default async function (url: string) {
	return axios
		.get(url)
		.then((res) => res.data)
		.catch((e) => {
			throw e;
		});
}

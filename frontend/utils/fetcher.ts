import axios from "axios";

export default function (url: string) {
	let access_token = sessionStorage.getItem("access_token");
	if (access_token)
		return axios
			.get(url, { headers: `Authorization: Bearer ${access_token}` })
			.then((res) => res.data)
			.catch((e) => {
				throw e;
			});
}

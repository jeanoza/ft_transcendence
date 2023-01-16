import axios from "axios";

export default function (url: string) {
	return axios.get(url).then((res) => res.data);
}

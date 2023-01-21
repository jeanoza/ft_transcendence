import "../styles/globals.css";
import type { AppProps } from "next/app";
import axios from "axios";
import { SWRConfig } from "swr";

axios.defaults.baseURL =
	process.env.NODE_ENV === "development"
		? "http://localhost:8888/api/"
		: "https://TO_PUT_URL_ON_PROD_LATER";
axios.defaults.withCredentials = true;

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SWRConfig>
			<Component {...pageProps} />
		</SWRConfig>
	);
}

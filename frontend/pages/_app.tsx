import "../styles/globals.css";
import type { AppProps } from "next/app";

import axios from "axios";
import Navbar from "../components/navbar";
import { useUser } from "../utils/customHooks";

axios.defaults.baseURL =
	process.env.NODE_ENV === "development"
		? "http://localhost:8888/api/"
		: "https://TO_PUT_URL_ON_PROD_LATER";
axios.defaults.withCredentials = true;

export default function App({ Component, pageProps }: AppProps) {
	const { user } = useUser(pageProps.token)

	return (
		<>
			<Navbar token={pageProps.token} />
			<Component {...pageProps} />
		</>
	);
}
export function getServerSideProps({ req }: any) {
	const token = req.cookies["access_token"] || null
	if (!token)
		return {
			redirect: {
				permanent: false,
				destination: "/auth",
			},
			props: {},
		};
	return { props: { token } }
}
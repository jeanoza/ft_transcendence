import axios from "axios";
import Navbar from "./navbar";
import Auth from "./auth";
import { Loader } from "./loader";
import fetcher from "../utils/fetcher";

axios.defaults.baseURL =
	process.env.NODE_ENV === "development"
		? "http://localhost:8888/api/"
		: "https://TO_PUT_URL_ON_PROD_LATER";
axios.defaults.withCredentials = true;


export function Layout({ children }: React.PropsWithChildren) {


	return (
		<div>
			<div className="container">{children}</div>
			<style jsx global>{`
				main {
					width: 50%;
					min-width: 400px;
					margin: auto;
				}
			`}</style>
		</div>
	);
}

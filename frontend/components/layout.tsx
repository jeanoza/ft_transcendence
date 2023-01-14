import Navbar from "./navbar";
import AppContext from "../utils/AppContext";
import { useCallback, useState } from "react";
import { BASE_URL, HEADER } from "../utils/global";
import axios from "axios";

export function Layout({ children }: React.PropsWithChildren) {
	const [logged, setLogged] = useState(false);
	const [user, setUser] = useState({ name: "", email: "" });

	//FIXME: here

	axios
		.get(BASE_URL + "user", { withCredentials: true })
		.then((res) => {
			console.log(res);
		})
		.catch((e) => {
			console.error("here", e.code);
		});

	//axios.get(BASE_URL + "user").then((res) => {
	//	console.log(res);
	//});

	//fetch(BASE_URL + "user", {
	//	method: "GET",
	//	headers: HEADER,
	//}).then((res) => {
	//	console.log("res1", res);
	//	return res.json();
	//});

	return (
		<AppContext.Provider
			value={{
				state: { logged, user },
				setLogged,
				setUser,
			}}
		>
			<Navbar />
			<div className="container">{children}</div>
			<style jsx global>{`
				.container {
					display: flex;
					justify-content: center !important;
				}
				.container > main {
					width: 50%;
					min-width: 400px;
				}
			`}</style>
		</AppContext.Provider>
	);
}

import Navbar from "./navbar";
import AppContext from "../utils/AppContext";
import { useState } from "react";
import { BASE_URL } from "../utils/global";

export function Layout({ children }: React.PropsWithChildren) {

	const [logged, setLogged] = useState(false);
	const [user, setUser] = useState({ name: "", email: "" })

	//FIXME: here
	//const test = fetch(BASE_URL + 'user', {
	//	method: 'GET',
	//}).then(res => {
	//	console.log(res);
	//})

	//console.log(test);

	return (
		<AppContext.Provider value={{
			state: { logged, user },
			setLogged,
			setUser
		}}>
			<Navbar />
			<div className="container">{children}</div>
			<style jsx global>{`
				.container {
					display:flex;
					justify-content: center!important;
				}
				.container > main{
					width:50%;
					min-width:400px;
				}
			`}</style>
		</AppContext.Provider>
	);
}

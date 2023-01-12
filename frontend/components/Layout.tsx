import Navbar from "./navbar";
import AppContext from "../utils/AppContext";
import { useState } from "react";

export function Layout({ children }: React.PropsWithChildren) {

	const [logged, setLogged] = useState(false);
	const [user, setUser] = useState({ name: "", email: "" })

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

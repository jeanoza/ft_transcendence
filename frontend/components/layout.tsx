import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/global";
import Navbar from "./navbar";
import useSWR from "swr";

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

export function Layout({ children }: React.PropsWithChildren) {
	const {
		data: userData,
		mutate: revalid,
		isLoading,
	} = useSWR("user", async (url) => {
		return await (
			await axios.get(url)
		).data;
	});

	console.log("home", userData);
	return (
		<div>
			<Navbar user={userData} revalid={revalid} />
			<div className="container">{children}</div>
			<style jsx global>{`
				.container > main {
					width: 50%;
					min-width: 400px;
					margin: auto;
				}
			`}</style>
		</div>
	);
}

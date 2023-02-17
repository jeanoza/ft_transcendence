import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { Layout } from "../components/layout";
import { Loader } from "../components/loader";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { InputField } from "../components/inputField";
import Router from "next/router";

export function getServerSideProps({ req }: any) {
	const accessToken = req.cookies["accessToken"] || null;
	if (!accessToken) {
		return {
			redirect: {
				permanent: false,
				destination: "/auth",
			},
			props: {},
		};
	}
	return { props: {} };
}
export default function _2fa() {
	const [_2faCode, set_2faCode] = useState<string>("");

	async function authenticate() {
		try {
			await axios.post("2fa/authenticate", {
				_2faCode,
			});
			set_2faCode("");
			Router.push("/");
		} catch (e: AxiosError | any) {
			window.alert(e.message);
		}
	}
	async function onSubmit2faByEnter(e: React.KeyboardEvent) {
		if (e.code === "Enter") authenticate();
	}
	function onGoAuthPage() {
		axios.get("auth/logout");
		Router.push("auth");
	}

	return (
		<Layout>
			<main className="d-flex column center">
				<h1 className="">Two Factor Auth</h1>
				<div>
					<InputField
						type="text"
						name="code"
						state={_2faCode}
						setState={set_2faCode}
						onKeyUp={onSubmit2faByEnter}
					/>
				</div>
				<div className="d-flex center gap">
					<button onClick={authenticate}>Send</button>
					<button onClick={onGoAuthPage}>Back to login</button>
				</div>
			</main>
		</Layout>
	);
}

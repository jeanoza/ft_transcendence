import { Layout } from "../components/layout";
import axios from "axios";
import React, { useState } from "react";
import { InputField } from "../components/inputField";
import Router from "next/router";
import { z } from "zod";
import DOMPurify from "dompurify";

const schema = z.object({
	_2faCode: z.string().length(6),
});

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
			const data = schema.parse({ _2faCode: DOMPurify.sanitize(_2faCode) });
			await axios.post("2fa/authenticate", data);
			set_2faCode("");
			Router.push("/");
		} catch (e: any) {
			//window.alert(e.message);
			if (e.name === "ZodError") {
				const error = JSON.parse(e);
				// just send 1st error to window.alert
				window.alert(error[0].path + " : " + error[0].message);
			} else if (e.response) window.alert(e.response.data?.message);
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

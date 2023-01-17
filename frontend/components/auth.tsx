import React, { useState } from "react";
import Seo from "./seo";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

type UserData = {
	name?: string;
	email: string;
	password: string;
};

export default function Auth({ revalid }: any) {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [newAccount, setNewAccount] = useState<boolean>(false);

	const router = useRouter();

	function toggleAccount() {
		setEmail("");
		setPassword("");
		setName("");
		setNewAccount((prev) => !prev);
	}

	async function loginWith42() {
		try {

			const res = await axios.get('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2b85232134731a3fb4d03b3253513557343dc939342f7e351a2a5ad2f269f4ae&redirect_uri=http%3A%2F%2Flocalhost%3A3333&response_type=code')
			console.log(res);
		} catch (e) {
			console.log(e);
		}
	}

	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.currentTarget;
		if (name === "email") setEmail(value);
		else if (name === "password") setPassword(value);
		else if (name === "name") setName(value);
	}
	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		let data: UserData = { email, password };
		let url = "user";

		if (newAccount) data = { name, ...data };
		else url += "/login";

		try {
			const res = await axios.post(url, data);

			if (!newAccount)
				localStorage.setItem("access_token", res.data.access_token);
			revalid();
		} catch (e: AxiosError | any) {
			window.alert(e?.response?.data?.message);
		}
	}
	return (
		<>
			<Seo title="Auth" />
			<main>
				<h1>Auth</h1>
				<form onSubmit={onSubmit}>
					<div>
						<label>
							Email
							<input
								type="email"
								name="email"
								onChange={onChange}
								value={email}
							/>
						</label>
					</div>
					<div>
						<label>
							Password
							<input
								type="password"
								name="password"
								onChange={onChange}
								value={password}
							/>
						</label>
					</div>
					{newAccount && (
						<div>
							<label>
								Name
								<input
									type="text"
									name="name"
									onChange={onChange}
									value={name}
								/>
							</label>
						</div>
					)}
					<div>
						<span>
							{newAccount
								? "You doesn't have yet account?"
								: "You have already account?"}
						</span>
						<span className="signup" onClick={toggleAccount}>
							{newAccount ? "Sign In" : "Create Account"}
						</span>
					</div>
					<div>
						<span>You want to authentificate with 42 ?</span>
						<Link href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2b85232134731a3fb4d03b3253513557343dc939342f7e351a2a5ad2f269f4ae&redirect_uri=http%3A%2F%2Flocalhost%3A3333&response_type=code">
							<span className="signup" >Click</span>
						</Link>
					</div>
					<button>{newAccount ? "Create Account" : "Sign In"} </button>
				</form>
			</main>
			<style jsx>{`
				label {
					width: 216px;
					display: flex;
					justify-content: space-between;
				}
				form > div {
					margin: 16px 0px;
				}
				.signup {
					text-decoration: underline;
					color: blue;
					cursor: pointer;
				}
			`}</style>
		</>
	);
}

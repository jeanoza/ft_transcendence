import React, { useState } from "react";
import Seo from "./seo";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";

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

			await axios.get('/user/login')
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
						<span className="signup" onClick={loginWith42}>Click</span>
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

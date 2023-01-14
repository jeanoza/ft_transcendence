import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/global";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import Seo from "../components/Seo";
import Navbar from "../components/navbar";
import axios from "axios";

type data = {
	name?: string;
	email: string;
	password: string;
}

//TODO: implement session or cookie to remain in logged
export async function getServerSideProps(context: any) {
	const _cookie = context.req.cookies["user"];
	if (_cookie) return { props: { user: JSON.parse(_cookie) } };
	return { props: {} };
}

export default function Auth({ user }: any) {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [newAccount, setNewAccount] = useState<boolean>(false);
	const [cookie, setCookie] = useCookies(["user"]);
	const router = useRouter();

	useEffect(() => {
		if (user) router.push("/")
	}, [user])

	function toggleAccount() {
		setEmail("");
		setPassword("");
		setName("");
		setNewAccount((prev) => !prev);
	}

	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.currentTarget;
		if (name === "email") setEmail(value);
		else if (name === "password") setPassword(value);
		else if (name === "name") setName(value);
	}
	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		let data: data = { email, password };
		let url = BASE_URL + 'user';

		if (newAccount) data = { name, ...data }
		else url += '/login'

		try {
			const res = await axios.post(url, data);
			setCookie("user", JSON.stringify(res.data));
			router.push("/");
		} catch (e) {
			window.alert(e)
		}
	}
	return (
		<>
			<Seo title="Home" />
			<Navbar user={user} />
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
							{newAccount ? "Sign In" : "Create Account"}{" "}
						</span>
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

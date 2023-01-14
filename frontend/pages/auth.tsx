import React, { useContext, useState } from "react";
import { BASE_URL, HEADER } from "../utils/global";
import AppContext from "../utils/AppContext";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import Seo from "../components/Seo";
import Navbar from "../components/navbar";

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

	console.log(cookie);
	//const context = useContext(AppContext);

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

		//FIXME: refactoring
		let res;
		if (newAccount) {
			res = await (
				await fetch(`${BASE_URL}` + "user", {
					method: "POST",
					headers: HEADER,
					body: JSON.stringify({
						email,
						password,
						name,
					}),
				})
			).json();
			if (res.error) return window.alert(res.message);
		} else {
			res = await (
				await fetch(`${BASE_URL}` + "user/login", {
					method: "POST",
					headers: HEADER,
					body: JSON.stringify({
						email,
						password,
					}),
				})
			).json();
			if (res.error) return window.alert(res.message);
		}
		setCookie("user", JSON.stringify(res));
		router.push("/");
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

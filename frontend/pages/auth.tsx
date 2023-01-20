import React, { useEffect, useState } from "react";
import Seo from "../components/seo";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { Layout } from "../components/layout";
import { useUser } from "../utils/hooks/useUser";
import { NotAuthNavbar } from "../components/navbar";

//type UserData = {
//	name: string;
//	email: string;
//	imageURL: string;
//};

export default function Auth() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [newAccount, setNewAccount] = useState<boolean>(false);
	const { revalid } = useUser();

	const router = useRouter();

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

		let data: IUser = { email, password };
		let url = "user";

		if (newAccount) data = { name, ...data };
		else url += "/login";

		try {
			await axios.post(url, data);
			//if (newAccount) {
			//	window.alert(
			//		"Your account has been successfully created. Please sign in"
			//	);
			//	toggleAccount();
			//} else router.push("/");
			router.push("/");
		} catch (e: AxiosError | any) {
			window.alert(e?.response?.data?.message);
		}
	}
	return (
		<Layout>
			<NotAuthNavbar />
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
						<Link href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-f7b65c738a72369be1182fdf9ec406461da8a335432f9f3f4d828e110d4b4b70&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fapi%2Fuser%2Fauth&response_type=code">
							<span className="signup">Click</span>
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
		</Layout>
	);
}

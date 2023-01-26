import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { InputField } from "../inputField";

export function AuthForm({ authUrl }: { authUrl: string }) {
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

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		let data: IUser = { email, password };
		let url = "user";

		if (newAccount) data = { name, ...data };
		else url += "/login";

		try {
			await axios.post(url, data);
			router.push("/");
		} catch (e: AxiosError | any) {
			window.alert(e?.response?.data?.message);
		}
	}

	return (
		<form onSubmit={onSubmit}>
			<InputField
				size="sm"
				type="email"
				name="email"
				state={email}
				setState={setEmail}
			/>
			<InputField
				size="sm"
				type="password"
				name="password"
				state={password}
				setState={setPassword}
			/>
			{newAccount && (
				<InputField
					size="sm"
					type="text"
					name="name"
					state={name}
					setState={setName}
				/>
			)}
			<div>
				<span>
					{newAccount
						? "You doesn't have yet account?"
						: "You have already account?"}
				</span>
				<span className="cursor-pointer" onClick={toggleAccount}>
					{newAccount ? "Sign In" : "Create Account"}
				</span>
			</div>
			<div>
				<span>You want to authentificate with 42 ?</span>
				<Link href={authUrl}>
					<span className="cursor-pointer">Click</span>
				</Link>
				{/*<span className="cursor-pointer" onClick={onClick}>Click</span>*/}
			</div>
			<div className="d-flex justify-end">
				<button>{newAccount ? "Create Account" : "Sign In"} </button>
			</div>
			<style jsx>{`
				form > div {
					margin: 16px 0px;
				}
			`}</style>
		</form>
	);
}

import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FormField } from "../formField";

export function AuthForm() {
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
			<FormField type="email" name="email" state={email} setState={setEmail} />
			<FormField
				type="password"
				name="password"
				state={password}
				setState={setPassword}
			/>
			{newAccount && (
				<FormField type="text" name="name" state={name} setState={setName} />
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
				<Link href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-f7b65c738a72369be1182fdf9ec406461da8a335432f9f3f4d828e110d4b4b70&redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fapi%2Fuser%2Fauth&response_type=code">
					<span className="cursor-pointer">Click</span>
				</Link>
			</div>
			<button>{newAccount ? "Create Account" : "Sign In"} </button>
			<style jsx>{`
				form > div {
					margin: 16px 0px;
				}
				.cursor-pointer {
					text-decoration: underline;
					color: blue;
					cursor: pointer;
				}
			`}</style>
		</form>
	);
}

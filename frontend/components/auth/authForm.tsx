import axios, { AxiosError, AxiosHeaders } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { InputField } from "../inputField";
import { z } from "zod";
import DOMPurify from "dompurify";

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(5).max(20),
	name: z.string().trim().min(1).max(20).optional(),
});

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

		let data: IUser = {
			email: DOMPurify.sanitize(email),
			password: DOMPurify.sanitize(password),
		};
		let url = "auth";

		if (newAccount) {
			// protection for empty name
			if (!name.length) return window.alert("You have to write your name!!");
			data = { name: DOMPurify.sanitize(name), ...data };
		} else url += "/login";

		try {
			const formData = schema.parse(data);
			await axios.post(url, formData);
			router.push("/");
		} catch (e: any) {
			if (e.name === "ZodError") {
				const error = JSON.parse(e);
				// just send 1st error to window.alert
				window.alert(error[0].path + " : " + error[0].message);
			} else if (e.response) window.alert(e.response.data?.message);
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
				<Link href="http://localhost:8888/api/auth/access42">
					<span className="cursor-pointer">Click</span>
				</Link>
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

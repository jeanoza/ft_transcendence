import axios, { AxiosError } from "axios";
import router from "next/router";
import { useState } from "react";
import { useUser } from "../../utils/hooks/useUser";
import { FormField } from "../formField";

export function NoteForm() {
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const { user } = useUser();
	console.log(user);
	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		let data: INote = { title, content };
		let url = "user";

		try {
			await axios.post(url, data);
			router.push("/");
		} catch (e: AxiosError | any) {
			window.alert(e?.response?.data?.message);
		}
	}
	return (
		<form onSubmit={onSubmit}>
			<FormField type="text" name="title" state={title} setState={setTitle} />
			<div>
				<button>Send</button>
			</div>
			<style jsx>{`
				form > div {
					margin: 16px 0px;
				}
			`}</style>
		</form>
	);
}

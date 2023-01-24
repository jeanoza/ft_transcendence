import axios, { AxiosError } from "axios";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "../../utils/hooks/useUser";
import { InputField } from "../inputField";
import { TextareaField } from "../textareaField";

/**
 * NoteForm general to create(post) or to update(patch) note
 * @param id
 * @returns
 */
export function NoteForm({ id }: { id?: string }) {
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const { user } = useUser();

	useEffect(() => {
		async function getNote() {
			let { data } = await axios(`/note/${id}`);
			setTitle(data.title);
			setContent(data.content);
		}
		if (id) getNote();
	}, []);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		let data: INote = { title, content, authorId: user.id };
		let url = "note/";
		if (id) {
			url += id;
			data = { id: Number(id), ...data };
		}

		try {
			await axios[id ? "patch" : "post"](url, data);
			router.push("/note");
		} catch (e: AxiosError | any) {
			window.alert(e?.response?.data?.message);
		}
	}
	return (
		<form onSubmit={onSubmit}>
			<InputField type="text" name="title" state={title} setState={setTitle} />
			<TextareaField name="content" state={content} setState={setContent} />
			<div className="d-flex justify-end">
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

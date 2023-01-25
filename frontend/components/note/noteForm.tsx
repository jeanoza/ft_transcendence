import axios, { AxiosError } from "axios";
import router, { useRouter } from "next/router";
import React, { ButtonHTMLAttributes, useEffect, useState } from "react";
import { useUser } from "../../utils/hooks/swrHelper";
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
	async function onDelete(e: React.MouseEvent) {
		e.preventDefault();
		if (window.confirm('Do you want remove this note?')) {
			try {
				const url = `/note/${id}`
				await axios.delete(url)
				router.push("/note")
			} catch (e: AxiosError | any) {
				window.alert(e?.response?.data?.message);
			}
		}
	}
	function onCancel(e: React.MouseEvent) {
		e.preventDefault();
		router.push("/note")
	}
	return (
		<form onSubmit={onSubmit}>
			<InputField type="text" name="title" state={title} setState={setTitle} />
			<TextareaField name="content" state={content} setState={setContent} />
			<div className="d-flex justify-end">
				<button>Send</button>
				{id && <button onClick={onDelete}>Delete</button>}
				<button onClick={onCancel}>Cancel</button>
			</div>
			<style jsx>{`
				form {
					margin-top:2rem;
				}
				form > div {
					margin: 1rem 0px;
				}
				.d-flex {
					gap:8px;
				}
			`}</style>
		</form>
	);
}

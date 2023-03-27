import React, { useState } from "react";
import { InputField } from "./inputField";
import axios from "axios";
import { useUser } from "../utils/hooks/swrHelper";
import { z } from "zod";
import DOMPurify from "dompurify";

const schema = z.object({
	name: z.string().trim().min(1).max(20),
});

export function UserInfo({
	user,
	isEditModal,
}: {
	user: IUser;
	isEditModal?: boolean;
}) {
	const [name, setName] = useState<string | any>(user.name);
	const { revalid } = useUser();

	async function onSubmitName(e: any) {
		if (e.code === "Enter" && name.length) {
			if (name === user.name) return;
			try {
				const formData = schema.parse({ name: DOMPurify.sanitize(name) });
				await axios.patch("user", formData);
				setName(formData.name);
				window.alert("updated");
				revalid();
			} catch (e: any) {
				setName(user.name);
				if (e.name === "ZodError") {
					const error = JSON.parse(e);
					// just send 1st error to window.alert
					window.alert(error[0].path + " : " + error[0].message);
				} else if (e.response) window.alert(e.response.data?.message);
			}
		}
	}

	return (
		<div className="user-info">
			{isEditModal ? (
				<InputField
					type="text"
					name="name"
					state={name}
					setState={setName}
					onKeyUp={onSubmitName}
				/>
			) : (
				<h3>{user.name}</h3>
			)}
			<div className="d-flex column gap">
				<div className="d-flex justify-between">
					<span>Email</span>
					<span>{user.email}</span>
				</div>
				<div className="d-flex justify-between">
					<span>Created at</span>
					<span>
						{user.createdAt && new Date(user.createdAt).toLocaleDateString()}
					</span>
				</div>
				<div className="d-flex justify-between">
					<span>Rank</span>
					<span>{user.rank}</span>
				</div>
			</div>
			<style jsx>{`
				h3 {
					margin-bottom: 1rem;
				}
			`}</style>
		</div>
	);
}

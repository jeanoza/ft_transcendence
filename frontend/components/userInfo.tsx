import React, { useState } from "react"
import { InputField } from "./inputField"
import axios from "axios"
import { useUser } from "../utils/hooks/swrHelper"

export function UserInfo({ user, isEditModal }: { user: IUser, isEditModal?: boolean }) {
	const [name, setName] = useState<string | any>(user.name)
	const { revalid } = useUser();

	async function onSubmitName(e: any) {
		if (e.code === "Enter" && name.length) {
			if (name === user.name) return;
			try {
				await axios.patch('user', { name: name.trim() })
				window.alert('updated')
				revalid();
			} catch (e: any) {
				window.alert(e?.response?.data.message);
			}
		}
	}

	return (
		<div className="user-info">
			{isEditModal ?
				<InputField type="text" name="name" state={name} setState={setName} onKeyUp={onSubmitName} />
				: <h3>{user.name}</h3>
			}
			<div className="d-flex column gap">
				<div className="d-flex justify-between">
					<span>Email</span>
					<span>
						{user.email}
					</span>
				</div>
				<div className="d-flex justify-between">
					<span>Created at</span>
					<span>{new Date(user.createdAt).toLocaleDateString()}</span>
				</div>
				<div className="d-flex justify-between">
					<span>Rank</span>
					<span>
						{user.rank ? user.rank : "not yet"}
					</span>
				</div>
			</div>
			<style jsx>{`
				h3 {
					margin-bottom:1rem
				}
			`}</style>
		</div>
	)
}
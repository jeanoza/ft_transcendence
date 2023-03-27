import axios from "axios";
import { useEffect, useState } from "react";
import { useAllPublicChannel, useChannel } from "../../utils/hooks/swrHelper";
import { InputField } from "../inputField";
import { Loader } from "../loader";
import { z } from "zod";

const schema = z.object({
	id: z.number(),
	password: z.string(),
	isPublic: z.boolean(),
});

export function UpdateChatModal({
	channelId,
	onClose,
}: {
	channelId: number;
	onClose: any;
}) {
	const { channel, isLoading } = useChannel(channelId);
	const [password, setPassword] = useState("");

	function handleClose(e: any) {
		e.preventDefault();
		if (e.target.classList.contains("modal-background")) onClose();
	}
	async function onSubmit() {
		try {
			const formData = schema.parse({
				id: channelId,
				password,
				isPublic: password.length ? false : true,
			});
			await axios.patch("channel", formData);
			onClose();
			window.alert("Channel password updated");
		} catch (e: any) {
			if (e.name === "ZodError") {
				const error = JSON.parse(e);
				// just send 1st error to window.alert
				window.alert(error[0].path + " : " + error[0].message);
			} else if (e.response) window.alert(e.response.data?.message);
		}
	}

	if (isLoading) return <Loader />;
	return (
		<div className="modal-background" onClick={handleClose}>
			<div className="modal-container">
				<h3>Update chat</h3>
				<form>
					<div className="field">
						<label>name </label>
						<input value={channel.name} readOnly />
					</div>
					<InputField
						type="password"
						name="password"
						state={password}
						setState={setPassword}
					/>
					<div className="d-flex justify-between gap">
						<button onClick={onSubmit}>Update</button>
						<button onClick={onClose}>Cancel</button>
					</div>
				</form>
			</div>
		</div>
	);
}

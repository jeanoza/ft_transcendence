import axios from "axios";
import { useEffect, useState } from "react";
import { useChannel } from "../../utils/hooks/swrHelper";
import { InputField } from "../inputField";
import { Loader } from "../loader";

export function UpdateChatModal({ channelId, onClose }: { channelId: number, onClose: any }) {
	const { channel, isLoading } = useChannel(channelId);
	const [password, setPassword] = useState("")


	function handleClose(e: any) {
		e.preventDefault();
		if (e.target.classList.contains("modal-background")) onClose();
	}
	async function onSubmit() {
		const _channel = {
			id: channelId,
			password,
			isPublic: password.length ? false : true
		}
		try {
			await axios.patch("channel", _channel);
			onClose();
			window.alert("Channel password updated");
		} catch (e) {
			console.log(e);
		}
	}

	if (isLoading) return <Loader />
	return <div className="modal-background" onClick={handleClose}>
		<div className="modal-container">
			<h3>Update chat</h3>
			<form>
				<div className="field">
					<label>name </label>
					<input value={channel.name} />
				</div>
				<InputField type="password" name="password" state={password} setState={setPassword} />
				<div className="d-flex justify-between gap">
					<button onClick={onSubmit}>Update</button>
					<button onClick={onClose}>Cancel</button>
				</div>
			</form>
		</div>
	</div>
}
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
		const channel = {
			id: channelId,
			password,
			isPublic: password.length ? false : true
		}
		//console.log(channel);
		try {
			const res = await axios.patch("channel", channel);
			console.log(res);
			onClose();
		} catch (e) {
			console.log(e);
		}
		//if (!name.length) return window.alert('Put channel name!')
		//socket.emit('newChannel', { channel, userId: user.id })
	}

	if (isLoading) return <Loader />
	return <div className="modal-background" onClick={handleClose}>
		<div className="modal-container">
			<h3>{channel.name}</h3>
			<form>
				<InputField type="password" name="password" state={password} setState={setPassword} />
				<div className="d-flex justify-between gap">
					<button onClick={onSubmit}>Update</button>
					<button onClick={onClose}>Cancel</button>
				</div>
			</form>
		</div>
	</div>
}
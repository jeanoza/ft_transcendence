import axios from "axios";
import { useEffect, useState } from "react";
import { useChannel } from "../../utils/hooks/swrHelper";
import { InputField } from "../inputField";
import { Loader } from "../loader";

export function ChannelModal({ channelId, onClose }: { channelId: number, onClose: any }) {
	const { channel, isLoading } = useChannel(channelId);
	const [password, setPassword] = useState("")


	function handleClose(e: any) {
		e.preventDefault();
		if (e.target.classList.contains("modal-background")) onClose();
	}

	if (isLoading) return <Loader />
	return <div className="modal-background" onClick={handleClose}>
		<div className="modal-container">
			<h3>{channel.name}</h3>
			<form>
				<InputField type="password" name="password" state={password} setState={setPassword} />
				<div className="d-flex justify-between gap">
					<button>Update</button>
					<button onClick={onClose}>Cancel</button>
				</div>
			</form>
		</div>
	</div>
}
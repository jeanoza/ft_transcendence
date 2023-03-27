import { useEffect, useState } from "react";
import { InputField } from "../inputField";
import { useSocket } from "../../utils/hooks/useSocket";
import {
	useAllChannel,
	useAllPublicChannel,
	useUser,
} from "../../utils/hooks/swrHelper";
import axios from "axios";

export function NewChatModal({ onClose }: { onClose: any }) {
	const [name, setName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const { socket } = useSocket("chat");
	const { user } = useUser();
	const { publicChannels } = useAllPublicChannel();
	const { revalid } = useAllChannel();

	//FIXME: see if better way => how to use callback with socketio in nest server??
	useEffect(() => {
		socket.on("channelRegistered", () => {
			revalid();
			setName("");
			setPassword("");
			onClose();
		});
		return () => {
			socket.off("channelRegistered");
		};
	}, []);

	function handleClose(e: any) {
		if (e.target.classList.contains("modal-background")) onClose();
	}

	function onSubmit() {
		const channel = {
			name,
			password,
			isPublic: password.length ? false : true,
		};
		if (!name.length) return window.alert("Put channel name!");
		socket.emit("newChannel", { channel, userId: user.id });
	}

	function handleClickChannel({ target }: any) {
		const name = target.innerText;
		setName(name);
		setPassword("");
	}

	return (
		<div className="modal-background" onClick={handleClose}>
			<div className="modal-container">
				<h3>New Chat</h3>
				<div className="d-flex gap justify-between">
					<div className="public-channels-container my-4 p-2">
						<h4>Public channels</h4>
						<ul>
							{publicChannels?.map((channel: { id: number; name: string }) => {
								const { id, name } = channel;
								return (
									<li
										className="p-1 px-2  m-1"
										key={id}
										onClick={handleClickChannel}
									>
										<span className="text-overflow d-flex center">
											{channel.name}
										</span>
									</li>
								);
							})}
						</ul>
					</div>
					<div>
						<InputField
							type="text"
							name="name"
							state={name}
							setState={setName}
						/>
						<InputField
							type="password"
							name="password"
							state={password}
							setState={setPassword}
						/>
					</div>
				</div>
				<div className="d-flex justify-end gap">
					<button onClick={onSubmit}>Join</button>
					<button onClick={onClose}>Cancel</button>
				</div>
			</div>
			<style jsx>{`
				.public-channels-container {
					border: 1px solid var(--gray-dark);
					border-radius: 8px;
				}
				.public-channels-container h4 {
					color: var(--accent);
					margin-bottom: 0.5rem;
				}
				.public-channels-container ul {
					max-height: 72px;
					overflow-y: auto;
				}
				.public-channels-container li {
					height: 20px;
					border: 1px solid var(--border-color);
					border-radius: 8px;
					cursor: pointer;
				}
				.public-channels-container li:hover {
					background-color: var(--gray-dark);
					color: white;
				}
				.text-overflow {
					width: 100px;
				}
			`}</style>
		</div>
	);
}

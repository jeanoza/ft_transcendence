import React, {
	ButtonHTMLAttributes,
	Dispatch,
	MouseEventHandler,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { useUser } from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";

//const channelList = ["chat1", "chat2", "chat3"]; // for test

export function ChannelList({
	channels,
	setModal,
	onChangeChannel
}: {
	channels: any[];
	setModal: Dispatch<SetStateAction<boolean>>;
	onChangeChannel: MouseEventHandler<HTMLElement>
}) {
	const { user } = useUser();
	const { socket } = useSocket("chat");

	useEffect(() => {
		socket.emit('enterChatPage', user.id);
	}, []);

	function openModal() {
		setModal(true);
	}
	return (
		<div className="cont d-flex column gap">
			<button onClick={openModal}>New Chat</button>
			<ul className="d-flex column">
				{channels.map((el) => (
					<li id={el.id} key={el.id} onClick={onChangeChannel}>
						{el.name}
					</li>
				))}
			</ul>
			<style jsx>{`
				.cont {
					border-right: 1px solid rgb(200, 200, 200);
					padding: 0.5rem;
				}
				ul {
					gap:0.1rem;
					overflow-y:auto;
				}
				li {
					padding:0.5rem;
					border-radius:8px;
				}
				li:hover {
					font-weight:500;
					background-color:rgb(220,220,220);
				}
				button {
					background-color: white;
					white-space:nowrap;
				}
				li.active {
					color: #06c;
					font-weight:500;
				}
			`}</style>
		</div>
	);
}

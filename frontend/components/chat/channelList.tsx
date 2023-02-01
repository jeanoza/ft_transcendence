import React, {
	ButtonHTMLAttributes,
	Dispatch,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { useUser } from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";

//const channelList = ["chat1", "chat2", "chat3"]; // for test

export function ChannelList({
	channel,
	setReceived,
	setChannel,
	setModal
}: {
	channel: string | null;
	setReceived: Dispatch<SetStateAction<{ sender: string; message: string }[]>>;
	setChannel: Dispatch<SetStateAction<string | null>>;
	setModal: Dispatch<SetStateAction<boolean>>;
}) {
	const { user } = useUser();
	const { socket } = useSocket("chat");
	const [channels, setChannels] = useState([]);

	useEffect(() => {
		socket.emit('enterChatPage', user.id);
		socket.on("channels", async (data) => {
			console.log(data);
			setChannels(data);
		});
		return () => {
			socket.off("channels");
		};
	}, []);

	function openModal() {
		setModal(true);
	}


	function onChangeChan() {

	}

	return (
		<div className="cont d-flex column gap">
			<button onClick={openModal}>New Chat</button>
			<ul className="d-flex column">
				{channels.map((el) => (
					<li id={el.id} key={el.id}>
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
					margin-right:1rem;
				}
				li:hover {
					font-weight:500;
					background-color:rgb(220,220,220);
				}
				button {
					background-color: white;
					white-space:nowrap;
					margin-right:8px;
				}
				button.active {
					/* FIXME: to modify after*/
					border-bottom: 1px solid black;
					border-right: 1px solid black;
					color: #06c;
					/*font-weight:600;*/
				}
			`}</style>
		</div>
	);
}

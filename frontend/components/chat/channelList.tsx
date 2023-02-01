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
		<div className="cont">
			<button onClick={openModal}>New Chat</button>
			<ul>
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
					padding:1rem 0;
					display: flex;
					flex-direction: column;
				}
				li {
					padding:0.5rem;
					/*margin:0.5rem 0;*/
					margin-bottom:0.5rem;
					width: 100%;
					background-color:rgb(100,100,100);
					border-radius:8px;
				}
				button {
					background-color: white;
					white-space:nowrap;
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

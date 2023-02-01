import {
	Dispatch,
	MouseEventHandler,
	SetStateAction,
	useEffect,
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
			<ul className="">
				{channels.map((el) => (
					<li className="d-flex justify-between gap" id={el.id} key={el.id} onClick={onChangeChannel} title={el.name}>
						<span>
							{el.name}
						</span>
						<div className="d-flex btnCont">
							<div>d</div>
							<div>m</div>
						</div>
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
					max-width:120px;
				}
				li {
					padding:0.5rem;
					border-radius:8px;

				}
				li > span {
					text-overflow:ellipsis;
					overflow:hidden;
				}
				li:hover {
					background-color:rgb(220,220,220);
				}
				li.active span{
					color: #06c;
					font-weight:500;
				}
				button {
					background-color: white;
					white-space:nowrap;
				}
				.btnCont > div{
					width:1rem;
					height:1rem;
					border-radius:50%;
					background-color:white;
				}
			`}</style>
		</div>
	);
}

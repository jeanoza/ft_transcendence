import { MouseEventHandler, useEffect } from "react";
import { useUser } from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";

export function ChannelList({
	channels,
	openModal,
	onChangeChannel,
}: {
	channels: any[];
	openModal: any;
	onChangeChannel: MouseEventHandler<HTMLElement>;
}) {
	const { user } = useUser();
	const { socket } = useSocket("chat");

	useEffect(() => {
		socket.emit("enterChatPage", user.id);
	}, []);

	return (
		<div className="cont d-flex column gap">
			<button onClick={openModal}>New Chat</button>
			<ul className="">
				{channels.map((el) => (
					<li
						className="d-flex center justify-between gap"
						id={el.id}
						key={el.id}
						onClick={onChangeChannel}
						title={el.name}
					>
						<span>{el.name}</span>
						<div className="d-flex btnCont">
							<div>S</div>
							<div>D</div>
						</div>
					</li>
				))}
			</ul>
			<style jsx>{`
				.cont {
					border-right: 1px solid var(--border-color);
					padding: 0.5rem;
				}
				ul {
					gap: 0.1rem;
					overflow-y: auto;
					width: 160px;
				}
				li {
					padding: 0.5rem;
					border-radius: 8px;
				}
				li > span {
					text-overflow: ellipsis;
					overflow: hidden;
				}
				li:hover {
					background-color: var(--gray-light-1);
				}
				li.active span {
					color: var(--accent);
					font-weight: 500;
				}
				button {
					white-space: nowrap;
				}
				.btnCont {
					gap: 0.5rem;
				}
				.btnCont > div {
					width: 1.5rem;
					height: 1.5rem;
					border-radius: 50%;
					/*background-color: white;*/
					text-align: center;
					line-height: 1.5rem;
					font-weight: 500;
				}
			`}</style>
		</div>
	);
}

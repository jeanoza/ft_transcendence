import { MouseEventHandler, useEffect } from "react";
import { useUser } from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";

export function ChannelList({
	channels,
	dms,
	openModal,
	channel,
	setChannel,
	setDm,
}: {
	channels: any[];
	dms: any[];
	openModal: any;
	channel: string | null,
	setChannel: any;
	setDm: any;
}) {
	const { user } = useUser();
	const { socket } = useSocket("chat");

	useEffect(() => {
		socket.emit("enterChatPage", user.id);
	}, []);

	function onChangeChannel(e: React.MouseEvent<HTMLElement>) {
		const target = e.currentTarget;
		//FIXME: this is a js method but another way with react?
		document.querySelector("li.active")?.classList.remove("active");
		target?.classList?.add("active");
		socket.emit('leaveChannel', { channelName: channel })
		setChannel(target?.title);
		setDm(null)
	}

	function onChangeDM(e: React.MouseEvent<HTMLElement>) {
		const target = e.currentTarget;
		//FIXME: this is a js method but another way with react?
		document.querySelector("li.active")?.classList.remove("active");
		target?.classList?.add("active");
		if (channel)
			socket.emit('leaveChannel', { channelName: channel })
		setChannel(null);
		setDm(target?.title)
	}

	return (
		<div className="cont d-flex column gap">
			<button onClick={openModal}>New Chat</button>
			<ul>
				<h4>Channels</h4>
				{channels?.map((el) => (
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
			<ul>
				<h4>DMs</h4>
				{dms?.map(el => (
					<li key={el.id} onClick={onChangeDM} title={el.name}>
						<span>{el.name}</span>
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
					cursor:pointer;
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

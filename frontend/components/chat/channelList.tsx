import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
	useAllChannel,
	useAllDM,
	useUser,
} from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";
import { Avatar } from "../avatar";

export function ChannelList({
	openUserModal,
	openChatModal,
	channelName,
	setChannelName,
	setDmName,
}: {
	openUserModal: any;
	openChatModal: any;
	channelName: string | null;
	setChannelName: any;
	setDmName: any;
}) {
	const { socket } = useSocket("chat");
	const { channels } = useAllChannel();
	const { dms } = useAllDM();

	function onChangeChannel(e: any) {
		if (e.target.closest("svg")) return;

		const target = e.currentTarget;
		//FIXME: this is a js method but another way with react?
		document.querySelector("li.active")?.classList.remove("active");
		target?.classList?.add("active");
		if (channelName) socket.emit("leaveChannel", { channelName });
		setChannelName(target?.title);
		setDmName(null);
	}

	function onChangeDM(e: any) {
		if (e.target.closest("svg")) return;

		const target = e.currentTarget;
		//FIXME: this is a js method but another way with react?
		document.querySelector("li.active")?.classList.remove("active");
		target?.classList?.add("active");
		if (channelName) socket.emit("leaveChannel", { channelName });
		setChannelName(null);
		setDmName(target?.title);
	}


	return (
		<div className="cont d-flex column gap">
			<button onClick={openChatModal}>New Chat</button>
			<h4>Channels</h4>
			<ul>
				{channels?.map((el: IChannel) => (
					<li
						className="d-flex center justify-between gap"
						key={el.id}
						title={el.name}
						onClick={onChangeChannel}
					>
						<span>{el.name}</span>
						<div className="icon-cont py-3 px-1">
							<FontAwesomeIcon icon="circle-info" />
						</div>
					</li>
				))}
			</ul>
			<h4>DMs</h4>
			<ul className="dms">
				{dms?.map((el: IUser) => (
					<li
						className="d-flex center justify-between "
						key={el.id}
						title={el.name}
						onClick={onChangeDM}
					>
						<Avatar size="sm" status={el.status} url={el.imageURL} />
						<span className="text-overflow mx-2">{el.name}</span>
						<div
							className="icon-cont py-3 px-1"
							onClick={() => openUserModal(el.id)}
						>
							<FontAwesomeIcon icon="circle-info" />
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
					width: 160px;
					min-width: 160px;
					max-width: 160px;
					overflow-y: auto;
				}
				li {
					position: relative;
					padding: 0.5rem;
					border-radius: 8px;
					cursor: pointer;
				}
				li span {
					width: 80px;
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
			`}</style>
		</div >
	);
}

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
	openNewChatModal,
	openUpdateChatModal,
	channelName,
	setChannelName,
	setDmName,
}: {
	openUserModal: any;
	openNewChatModal: any;
	openUpdateChatModal: any;
	channelName: string | null;
	setChannelName: any;
	setDmName: any;
}) {
	const { user } = useUser();
	const { socket } = useSocket("chat");
	const { channels } = useAllChannel();
	const { dms } = useAllDM();


	function onChangeChannel(e: any) {
		if (e.target.closest("svg")) return;

		const target = e.currentTarget;
		//FIXME: this is a js method but another way with react?
		if (channelName !== target?.title) {
			document.querySelector("li.active")?.classList.remove("active");
			target?.classList?.add("active");
			if (channelName)
				socket.emit("leaveChannel", { channelName });
			setChannelName(target?.title);
			setDmName(null);
		}
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
			<button onClick={openNewChatModal}>New Chat</button>
			<h4>Channels</h4>
			<ul>
				{channels?.map((channel: IChannel) => (
					<li
						className="d-flex center justify-between gap"
						key={channel.id}
						title={channel.name}
						onClick={onChangeChannel}
					>
						<span>{channel.name}</span>
						{channel.ownerId === user.id
							&& (
								<div className="icons">
									<div className="icon-cont p-1" onClick={() => openUpdateChatModal(channel.id)}>
										<FontAwesomeIcon icon="gear" />
									</div>
								</div>
							)
						}
					</li>
				))}
			</ul>
			<h4>DMs</h4>
			<ul className="dms">
				{dms?.map((user: IUser) => (
					<li
						className="d-flex center justify-start"
						key={user.id}
						title={user.name}
						onClick={onChangeDM}
					>
						<Avatar size="sm" status={user.status} url={user.imageURL} />
						<span className="text-overflow mx-2">{user.name}</span>
						<div className="icons">
							<div
								className="icon-cont p-1"
								onClick={() => openUserModal(user.id)}
							>
								<FontAwesomeIcon icon="user" />
							</div>
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
					min-height:3rem;
					cursor: pointer;
				}
				li span {
					width: 80px;
				}
				li .icons {
					display:none;
				}
				li:hover {
					background-color: var(--gray-light-1);
				}
				li:hover .icons {
					display:block;
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

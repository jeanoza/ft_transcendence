import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	useAllChannelByUserId,
	useAllDmByUserId,
	useUser,
} from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";
import { Avatar } from "../avatar";

export function ChannelList({
	openUserModal,
	openChatModal,
	channel,
	setChannel,
	setDm,
}: {
	openUserModal: any;
	openChatModal: any;
	channel: string | null;
	setChannel: any;
	setDm: any;
}) {
	const { user } = useUser();
	const { socket } = useSocket("chat");
	const { channels } = useAllChannelByUserId(user.id);
	const { dms } = useAllDmByUserId(user.id);

	function onChangeChannel(e: React.MouseEvent<HTMLElement>) {
		const target = e.currentTarget;
		//FIXME: this is a js method but another way with react?
		document.querySelector("li.active")?.classList.remove("active");
		target?.classList?.add("active");
		socket.emit("leaveChannel", { channelName: channel });
		setChannel(target?.title);
		setDm(null);
	}

	function onChangeDM(e: React.MouseEvent<HTMLElement>) {
		const target = e.currentTarget;
		//FIXME: this is a js method but another way with react?
		document.querySelector("li.active")?.classList.remove("active");
		target?.classList?.add("active");
		if (channel) socket.emit("leaveChannel", { channelName: channel });
		setChannel(null);
		setDm(target?.title);
	}

	return (
		<div className="cont d-flex column gap">
			<button onClick={openChatModal}>New Chat</button>
			<h4>Channels</h4>
			<ul>
				{channels?.map((el: IChannel) => (
					<li
						className="d-flex center justify-between gap"
						//id={String(el.id)}
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
			<h4>DMs</h4>
			<ul className="dms">
				{dms?.map((el: IUser) => (
					<li
						className="d-flex center justify-between "
						key={el.id}
						onClick={onChangeDM}
						title={el.name}
					>
						<Avatar size="sm" status={el.status} url={el.imageURL} />
						<span className="text-overflow">{el.name}</span>
						<FontAwesomeIcon
							icon="circle-info"
							onClick={() => openUserModal(el.id)}
						/>
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
				.btnCont {
					gap: 0.5rem;
				}
				.btnCont > div {
					width: 1.5rem;
					height: 1.5rem;
					border-radius: 50%;
					text-align: center;
					line-height: 1.5rem;
					font-weight: 500;
				}
			`}</style>
		</div>
	);
}

import { useAllChannelByUserId, useAllDmByUserId, useUser } from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";
import { Avatar } from "../avatar";

export function ChannelList({
	openModal,
	channel,
	setChannel,
	setDm,
}: {
	openModal: any;
	channel: string | null,
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
			<ul className="dms">
				<h4>DMs</h4>
				{dms?.map((el: IUser) => (
					<li className="d-flex center justify-start gap" key={el.id} onClick={onChangeDM} title={el.name}>
						<Avatar size="sm" status={el.status} url={el.imageURL} />
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
				.dms > li {
					padding:0;
					margin:0.5rem 0;
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

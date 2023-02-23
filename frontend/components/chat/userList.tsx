import { useEffect, useState } from "react";
import { useSocket } from "../../utils/hooks/useSocket";
import { Avatar } from "../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	useAllUsersInChannel,
	useChannel,
	useIsAdmin,
	useIsBanned,
	useIsOwner,
	useUser,
} from "../../utils/hooks/swrHelper";

export function UserList({
	channelName,
	openUserModal,
}: {
	channelName: string | null;
	openUserModal: any;
}) {
	const { socket } = useSocket("chat");
	const { user: currentUser } = useUser();
	const { users, revalid } = useAllUsersInChannel(channelName!);
	const { channel, revalid: revalidChannel } = useChannel(channelName!);
	const { isAdmin: currentIsAdmin, revalid: revalidAdmin } = useIsAdmin(
		channelName!
	);
	const { isOwner: currentIsOwner, revalid: revalidOwner } = useIsOwner(
		channelName!
	);
	const { isBanned: currentIsBanned, revalid: revalidBanned } = useIsBanned(
		channelName!
	);
	const [socketsInChannel, setSocketsInChannel] = useState<string[] | null>(null);

	useEffect(() => {
		socket.on("revalidBanned", function () {
			revalidBanned();
			revalidChannel();
		});
		socket.on("revalidMuted", function () {
			//revalidMuted();
			revalidChannel();
		});
		socket.on("revalidAdmin", function () {
			revalidAdmin();
			revalidChannel();
		});
		return () => {
			//clean up socket event
			socket.off("revalidAdmin");
			socket.off("revalidBanned");
			socket.off("revalidMuted");
		};
	}, [channel]);

	useEffect(() => {
		socket.on("revalidUsers", function (sockets) {
			setSocketsInChannel(sockets);
			revalid();
		});
		return () => {
			//clean up socket event
			socket.off("revalidUsers");
		};
	}, []);

	function isMuted(userId: number): boolean {
		if (channel.mutedIds.find((mutedId: number) => mutedId === userId))
			return true;
		return false;
	}

	function isBanned(userId: number): boolean {
		if (channel.bannedIds.find((bannedId: number) => bannedId === userId))
			return true;
		return false;
	}

	function isAdmin(userId: number): boolean {
		if (channel.adminIds.find((adminId: number) => adminId === userId))
			return true;
		return false;
	}

	function canAdminAction(userId: number) {
		//self and owner must not be banned
		if (userId === currentUser.id || userId === channel.ownerId) return false;
		//owner can ban everyone
		if (currentIsOwner) return true;
		//admin can not ban other admin
		if (currentIsAdmin && !isAdmin(userId)) return true;
		return false;
	}

	function canGiveAdmin(userId: number) {
		if (userId === currentUser.id || userId === channel.ownerId) return false;
		if (currentIsOwner) return true;
		return false;
	}

	function handleGiveAdmin(userId: number, userName: string) {
		const message = isAdmin(userId) ? "deprive" : "give";
		if (window.confirm(`Do you wanna ${message} admin to ${userName}?`))
			socket.emit("giveAdmin", { channelName, userId });
	}

	function handleBanUser(userId: number, userName: string) {
		//const message = isBanned(userId) ? "give access to channel to" : "ban";
		if (isBanned(userId))
			return window.alert(`${userName} is already banned!`)
		if (window.confirm(`Do you wanna ban ${userName}?`))
			socket.emit("banUser", { channelName, userId });
	}

	function handleMuteUser(userId: number, userName: string) {
		if (isMuted(userId))
			return window.alert(`${userName} is already muted!`)
		if (window.confirm(`Do you wanna mute ${userName}?`))
			socket.emit("muteUser", { channelName, userId });
	}

	function handleKickUser(userId: number, userName: string) {
		if (window.confirm(`Do you wanna kick ${userName}?`)) {
			socket.emit("kickUser", { channelName, userId });
		}
	}

	function validateConnection(socketName?: string) {
		if (socketName && socketsInChannel?.find(el => el === socketName))
			return "connected"
		return "non-connected"
	}

	if (!users || !channel || !currentUser || currentIsBanned) return null;
	return (
		<div className="cont">
			<ul>
				{users.map((user: IUser) => (
					<li key={user.id} className="d-flex center justify-start p-2 cursor">
						<Avatar url={user.imageURL} status={user.status} size="sm" />
						<span className={`m-2 text-overflow ${validateConnection(user.chatSocket)}`}>{user.name}</span>
						<div className="d-flex justify-end icons">
							{user.id && canGiveAdmin(user.id) && (
								<div
									className={`icon-cont p-1 ${channel && isAdmin(user.id!) ? "active" : ""
										}`}
									onClick={() => handleGiveAdmin(user.id!, user.name!)}
								>
									<FontAwesomeIcon icon={"hand"} />
									{/*<FontAwesomeIcon icon={["far", "hand"]} />*/}
								</div>
							)}
							{user.id && canAdminAction(user.id) && (
								<>
									<div className={`icon-cont p-1 ${channel && isMuted(user.id!) ? "active" : ""}`}
										onClick={() => handleMuteUser(user.id!, user.name!)} >
										<FontAwesomeIcon icon="comment-slash" />
									</div>
									<div className="icon-cont p-1" onClick={() => handleKickUser(user.id!, user.name!)}>
										<FontAwesomeIcon icon="user-slash" />
									</div>
									<div
										className={`icon-cont p-1 ${channel && isBanned(user.id!) ? "active" : ""}`}
										onClick={() => handleBanUser(user.id!, user.name!)}
									>
										<FontAwesomeIcon icon="ban" />
									</div>
								</>
							)}
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
					padding: 0.5rem;
					border-left: 1px solid var(--border-color);
				}
				ul {
					display: flex;
					flex-direction: column;
					width: 160px;
					min-width: 160px;
					max-width: 160px;
				}
				span {
					width: 80px;
				}
				li {
					border-radius: 8px;
				}
				li:hover {
					background-color: var(--gray-light-1);
				}
				li .icons{
					display:none;
				}
				li:hover .icons{
					display:flex;
				}
				.non-connected {
					color:var(--nav-font-color);
				}
				.active {
					color: var(--accent);
				}
			`}</style>
		</div >
	);
}

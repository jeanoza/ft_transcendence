import { useEffect, useState } from "react";
import { useSocket } from "../../utils/hooks/useSocket";
import { Avatar } from "../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAllUsersInChannel, useChannel, useIsAdmin, useIsOwner, useUser } from "../../utils/hooks/swrHelper";

export function UserList({ channelName, openUserModal }: { channelName: string | null, openUserModal: any }) {
	const { socket } = useSocket("chat");
	const { user: currentUser } = useUser();
	const { users, revalid } = useAllUsersInChannel(channelName!)
	const { channel, revalid: revalidChannel } = useChannel(channelName!);
	const { isAdmin: currentIsAdmin } = useIsAdmin(channelName!);
	const { isOwner: currentIsOwner } = useIsOwner(channelName!);

	console.log(channel);

	useEffect(() => {
		socket.on("revalidUsers", function () {
			revalid();
		});
		socket.on("revalidChannel", function () {
			revalidChannel();
		});
		return () => {
			//clean up socket event
			socket.off("revalidUsers");
			socket.off("revalidChannel");
		};
	}, []);

	function isAdmin(userId: number): boolean {
		if (channel.adminIds.find((adminId: number) => adminId === userId))
			return true;
		return false;
	}

	async function canBan(userId: number) {
		//self and owner must not be banned
		if (userId === currentUser.id || userId === channel.ownerId) return false;
		//owner can ban everyone
		if (currentIsOwner) return true;
		//admin can not ban other admin
		if (currentIsAdmin && !isAdmin(userId)) return true;
		return false;
	}


	async function canGiveAdmin(userId: number) {
		if (userId === currentUser.id || userId === channel.ownerId) return false;
		if (currentIsOwner) return true;
		return false;
	}

	function handleGiveAdmin(userId: number) {
		socket.emit('giveAdmin', { channelName, userId });
	}

	function handleOnBan(userId: number) {
		console.log('ban', userId)
	}

	if (!users || !channel || !currentUser) return null;
	return (
		<div className="cont">
			<ul>
				{users.map((user: IUser) => (
					<li key={user.id} className="d-flex center justify-between p-2 cursor">
						<Avatar url={user.imageURL} status={user.status} size="sm"></Avatar>
						<span className="mx-2 text-overflow">{user.name}</span>
						<div className="d-flex icons">
							{canGiveAdmin(user.id!) &&
								<div
									className={`icon-cont p-1 ${isAdmin(user.id!) ? "active" : ""}`}
									onClick={() => handleGiveAdmin(user.id!)}>
									<FontAwesomeIcon icon={"hand"} />
									{/*<FontAwesomeIcon icon={["far", "hand"]} />*/}
								</div>
							}
							{canBan(user.id!) &&
								<>
									<div className="icon-cont p-1" onClick={() => handleOnBan(user.id!)}>
										<FontAwesomeIcon icon="ban" />
									</div>
									<div
										className="icon-cont p-1"
									>
										<FontAwesomeIcon icon="comment-slash" />
									</div>
								</>
							}
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
				}
				span {
					width:80px;
				}
				li {
					border-radius: 8px;
				}
				li:hover {
					background-color: var(--gray-light-1);
				}
				.active {
					color:var(--accent);
				}
			`}</style>
		</div >

	);
}

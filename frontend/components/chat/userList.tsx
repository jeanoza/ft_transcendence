import { useEffect, useState } from "react";
import { useSocket } from "../../utils/hooks/useSocket";
import { Avatar } from "../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAllUsersInChannel, useChannel, useIsAdmin, useIsOwner, useUser } from "../../utils/hooks/swrHelper";

export function UserList({ channelName, openUserModal }: { channelName: string | null, openUserModal: any }) {
	const { socket } = useSocket("chat");
	const { user: currentUser } = useUser();
	const { users, revalid } = useAllUsersInChannel(channelName!)
	const { channel } = useChannel(channelName!);
	const { isAdmin } = useIsAdmin(channelName!);
	const { isOwner } = useIsOwner(channelName!);

	function canBan(userId: number) {
		//self and owner must not be banned
		if (userId === currentUser.id || userId === channel.ownerId) return false;
		//owner can ban everyone
		if (isOwner) return true;
		//admin can not ban other admin
		if (isAdmin && channel.adminIds.find((adminId: number) => adminId !== userId)) return true;
		return false;
	}

	function canGiveAdmin(userId: number) {
		if (userId === currentUser.id || userId === channel.ownerId) return false;
		if (isOwner) return true;
		return false;
	}


	useEffect(() => {
		socket.on("revalidUsers", function () {
			revalid();
		});
		return () => {
			//clean up socket event
			socket.off("revalidUsers");
		};
	}, []);


	if (!users) return null;
	return (
		<div className="cont">
			<ul>
				{users.map((user: IUser, index: string) => (
					<li key={index} className="d-flex center justify-between p-2 cursor">
						<Avatar url={user.imageURL} status={user.status} size="sm"></Avatar>
						<span className="mx-2 text-overflow">{user.name}</span>
						<div className="d-flex icons">
							{canGiveAdmin(user.id!) &&
								<div
									className="icon-cont py-3 px-1"
								>
									<FontAwesomeIcon icon="user-plus" />
								</div>
							}
							{canBan(user.id!) &&
								<div className="icon-cont py-3 px-1">
									<FontAwesomeIcon icon="ban" />
								</div>
							}
							<div
								className="icon-cont py-3 px-1"
								onClick={() => openUserModal(user.id)}
							>
								<FontAwesomeIcon icon="circle-info" />
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
			`}</style>
		</div >

	);
}

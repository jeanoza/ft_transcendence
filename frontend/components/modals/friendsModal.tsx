import axios from "axios";
import { useAllFriend, useFriend, useUser, useUserById } from "../../utils/hooks/swrHelper";
import React, { useState } from "react";
import { FriendsCont } from "./friends/friendsCont";
import { BlockedsCont } from "./friends/blockedsCont";

export function FriendsModal({
	onClose,
}: {
	onClose: any;
}) {
	const { user } = useUser();
	const { friends } = useAllFriend();
	const [isFriendsTab, setFriendsTab] = useState<boolean>(true);
	const [isBlockedsTab, setBlockedTab] = useState<boolean>(false);



	function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		const { name } = e.currentTarget;
		if (name === "friends") {
			setFriendsTab(true);
			setBlockedTab(false);
		} else if (name === "blockeds") {
			setFriendsTab(false);
			setBlockedTab(true);
		}
	}

	function handleClose(e: any) {
		if (e.target.classList.contains("modal-background")) onClose();
	}
	console.log(friends);

	if (!user) return null;
	return (
		<div className="modal-background" onClick={handleClose}>
			<div className="modal-container">
				<div className="header d-flex center justify-between gap">
					<button className={isFriendsTab ? "active" : ""} name="friends" onClick={handleClick}>Friends</button>
					<button className={isBlockedsTab ? "active" : ""} name="blockeds" onClick={handleClick}>Blockeds</button>
				</div>
				{friends && isFriendsTab && <FriendsCont />}
				{isBlockedsTab && <BlockedsCont />}
			</div>
			<style jsx>{`
				button.active {
					background-color:var(--gray-dark);
					color:white;
				}
				.modal-container {
					height:400px;
				}
				.header {
					padding-bottom:1rem;
					border-bottom:1px solid var(--border-color);
				}
			`}</style>
		</div >
	);
}

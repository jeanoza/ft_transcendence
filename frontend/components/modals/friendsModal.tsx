import { useAllFriend, useUser } from "../../utils/hooks/swrHelper";
import React, { useState } from "react";
import { FriendsCont } from "./friends/friendsCont";
import { BlockedsCont } from "./friends/blockedsCont";
import { UserModal } from "./userModal";

export function FriendsModal({ onClose }: { onClose: any }) {
	const { user } = useUser();
	const { friends } = useAllFriend();
	const [isFriendsTab, setFriendsTab] = useState<boolean>(true);
	const [isBlockedsTab, setBlockedTab] = useState<boolean>(false);
	const [openUserModal, setUserModal] = useState<boolean>(false);
	const [userId, setUserId] = useState<number | null>(null);

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
	function handleOpenUserModal(id: number) {
		setUserId(id);
		setUserModal(true);
	}

	function handleClose(e: any) {
		if (e.target.classList.contains("modal-background")) onClose();
	}

	if (!user) return null;
	return (
		<div className="modal-background" onClick={handleClose}>
			<div className="modal-container">
				<div className="header d-flex center justify-between gap">
					<button
						className={isFriendsTab ? "active" : ""}
						name="friends"
						onClick={handleClick}
					>
						Friends
					</button>
					<button
						className={isBlockedsTab ? "active" : ""}
						name="blockeds"
						onClick={handleClick}
					>
						Blockeds
					</button>
				</div>
				{friends && isFriendsTab && <FriendsCont openUserModal={handleOpenUserModal} />}
				{isBlockedsTab && <BlockedsCont openUserModal={handleOpenUserModal} />}
				{openUserModal && userId && (
					<UserModal userId={userId} onClose={() => setUserModal(false)} />
				)}
			</div>
			<style jsx>{`
				button.active {
					background-color: var(--bg-accent);
					color: white;
				}
				.modal-container {
					height: 400px;
				}
				.header {
					padding-bottom: 1rem;
					border-bottom: 1px solid var(--border-color);
					margin-bottom: 1rem;
				}
			`}</style>
		</div>
	);
}

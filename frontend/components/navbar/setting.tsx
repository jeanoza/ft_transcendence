import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useUser } from "../../utils/hooks/swrHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditModal from "../modals/editModal";
import { FriendsModal } from "../modals/friendsModal";
import { Avatar } from "../avatar";

export function Setting() {
	const { user } = useUser();
	const [dropdown, setDropdown] = useState<boolean>(false);
	const [openEditModal, setEditModal] = useState<boolean>(false);
	const [openFriendsModal, setFriendsModal] = useState<boolean>(false);
	const router = useRouter();

	async function onLogout(e: React.MouseEvent<HTMLSpanElement>) {
		try {
			await axios.get("auth/logout");
			router.reload();
		} catch (err) {
			throw err;
		}
	}
	function onToggle(e: any) {
		setDropdown((prev) => !prev);
	}
	return (
		<div className="setting d-flex center gap justify-end">
			<div className="icon" onClick={onToggle}>
				<FontAwesomeIcon icon="gear" />
			</div>
			{dropdown && (
				<div className="user-menu">
					<div className="user-resume d-flex column center gap">
						<Avatar url={user.imageURL} status={user.status} />
						<h3>{user.name}</h3>
						<span>{user.email}</span>
					</div>
					<ul>
						<li onClick={() => setEditModal(true)}>Edit</li>
						<li>Match History</li>
						<li onClick={() => setFriendsModal(true)}>Friends</li>
						<li onClick={onLogout}>Logout</li>
					</ul>
				</div>
			)}
			<style jsx>{`
				.icon {
					padding: 1rem;
				}
				.setting {
					position: relative;
					width: 160px;
					cursor: pointer;
				}
				.user-resume {
					padding: 1rem;
					cursor: auto;
				}
				.user-menu {
					z-index:1;
					position: absolute;
					top: 42px;
					left: 0;
					right: 0;
					color: var(--gray-dark);
					background: white;
					border: 1px solid var(--border-color);
					border-top: none;
					border-radius: 0 0 8px 8px;
				}
				li {
					padding: 0.5rem;
					text-align: center;
				}
				li:last-child {
					border-radius: 0 0 8px 8px;
				}
				li:hover {
					background-color: var(--border-color);
					color: white;
				}
			`}</style>
			{openEditModal && <EditModal onClose={() => setEditModal(false)} />}
			{openFriendsModal && (
				<FriendsModal onClose={() => setFriendsModal(false)} />
			)}
		</div>
	);
}

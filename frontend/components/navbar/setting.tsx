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

	return (
		<div className="setting d-flex center gap justify-end">
			<div className="icon">
				<FontAwesomeIcon icon="gear" size="lg" />
			</div>
			<div className="nav-dropdown-menu">
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
			{openEditModal && <EditModal onClose={() => setEditModal(false)} />}
			{openFriendsModal && (
				<FriendsModal onClose={() => setFriendsModal(false)} />
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
				.nav-dropdown-menu {
					top: 42px;
					right:1rem;
					visibility:hidden;
					opacity:0;
					transition: opacity 0.3s linear;
				}
				.setting:hover > .nav-dropdown-menu {
					visibility:visible;
					opacity:1;
				}
				
				.nav-dropdown-menu li {
					text-align: center;

				}
				.user-resume {
					padding: 1rem;
					cursor: auto;
				}
			`}</style>
		</div>
	);
}

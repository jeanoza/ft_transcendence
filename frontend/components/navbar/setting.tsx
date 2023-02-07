import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useUser } from "../../utils/hooks/swrHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditModal from "../modals/editModal";

export function Setting() {
	const { user } = useUser();
	const [dropdown, setDropdown] = useState<boolean>(false);
	const [openEditModal, setEditModal] = useState<boolean>(false);
	const router = useRouter();

	async function onLogout(e: React.MouseEvent<HTMLSpanElement>) {
		try {
			await axios.get("auth/logout");
			router.push("/");
		} catch (err) {
			throw err;
		}
	}
	function onToggle(e: any) {
		setDropdown(prev => !prev)
	}
	return (
		<div className="setting d-flex center gap justify-end" >
			<div>
				<FontAwesomeIcon icon="gear" onClick={onToggle} />
			</div>
			{dropdown && (
				<div className="user-menu">
					<div className="user-resume d-flex column center gap">
						<div
							className="avatar"
							style={{
								backgroundImage: `url(${user.imageURL})`
							}}
						>
							<div className="status ingame"></div>
						</div>
						<h3>{user.name}</h3>
						<span>{user.email}</span>
					</div>
					<ul>
						<li onClick={() => setEditModal(true)}>Edit</li>
						<li>Match History</li>
						<li>Friends</li>
						<li onClick={onLogout}>Logout</li>
					</ul>
				</div>
			)}
			<style jsx>{`
				.setting {
					position:relative;
					width:184px;
					cursor: pointer;
				}
				.user-resume {
					padding:1rem;
					cursor:auto;
				}
				.avatar {
					width: 7rem;
					height: 7rem;
				}
				.user-menu {
					position: absolute;
					top: 30px;
					left: 0;
					right:0;
					color:#424245;
					background:white;
					border:1px solid rgb(200,200,200);
					border-top:none;
					border-radius:0 0 8px 8px;
				}
				li {
					padding:0.5rem;
					text-align:center;
				}
				li:last-child {
					border-radius:0 0 8px 8px;
				}
				li:hover {
					background-color:rgb(200,200,200);
					color:white;
				}
			`}</style>
			{openEditModal && <EditModal onClose={() => setEditModal(false)} />}
		</div>
	);
}

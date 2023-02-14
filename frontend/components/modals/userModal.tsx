import axios from "axios";
import {
	useAllFriend,
	useBlocked,
	useFriend,
	useUser,
	useUserById,
} from "../../utils/hooks/swrHelper";
import { Avatar } from "../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserInfo } from "../userInfo";
import { useSocket } from "../../utils/hooks/useSocket";
import { DmModal } from "./dmModal";
import { useState } from "react";

export function UserModal({
	userId,
	onClose,
}: {
	userId: number;
	onClose: any;
}) {
	const { user } = useUser();
	const { userData } = useUserById(userId);
	const { friend, revalid: revalidFriend } = useFriend(userId);
	const { blocked, revalid: revalidBlocked } = useBlocked(userId);
	const { socket } = useSocket('chat')
	const [openDmModal, setDmModal] = useState<boolean>(false);

	function handleClose(e: any) {
		if (e.target.classList.contains("modal-background")) onClose();
	}

	async function addFriend() {
		try {
			await axios.post(`friend`, { userId });
			window.alert(`${userData.name} is added`);
			revalidFriend();
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}
	async function deleteFriend() {
		try {
			await axios.delete(`friend/${userId}`);
			window.alert(`${userData.name} is deleted`);
			revalidFriend();
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}

	async function blockUser() {
		try {
			await axios.post(`blocked`, { userId });
			window.alert(`${userData.name} is blocked`);
			revalidBlocked();
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}
	async function unblockUser() {
		try {
			await axios.delete(`blocked/${userId}`);
			window.alert(`${userData.name} is unblocked`);
			revalidBlocked();
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}



	if (!user) return null;
	return (
		<div className="modal-background" onClick={handleClose}>
			{userData && (
				<div className="modal-container">
					<div className="row d-flex justify-between gap">
						<Avatar
							url={userData.imageURL}
							status={userData.status}
							size="lg"
						/>
						{userData.id !== user.id && (
							<div className="btn-cont d-flex center column gap">
								<div className="d-flex center gap">
									{userData.id !== friend?.id ? (
										<button className="btn" onClick={addFriend}>
											Add
										</button>
									) : (
										<button className="btn" onClick={deleteFriend}>
											Delete
										</button>
									)}
									{userData.id !== blocked?.id ? (
										<button className="btn" onClick={blockUser}>
											Block
										</button>
									) : (
										<button className="btn" onClick={unblockUser}>
											Unblock{" "}
										</button>
									)}
								</div>
								<div className="d-flex center gap">
									<button className="btn" onClick={() => setDmModal(true)}>DM</button>
									<button className="btn">Play</button>
								</div>
							</div>
						)}
					</div>
					<UserInfo user={userData} />
				</div>
			)}
			{openDmModal && <DmModal receiver={userData} onClose={() => setDmModal(false)} />}
			<style jsx>{`
				.btn {
					width: 8rem;
				}
				.row {
					margin-bottom: 1rem;
				}
			`}</style>
		</div>
	);
}

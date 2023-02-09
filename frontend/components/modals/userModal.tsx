import axios from "axios";
import { useAllFriend, useBlocked, useFriend, useUser, useUserById } from "../../utils/hooks/swrHelper";
import { Avatar } from "../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function UserModal({
	userId,
	onClose,
}: {
	userId: number
	onClose: any;
}) {
	const { user } = useUser();
	const { userData } = useUserById(userId);
	const { friend, revalid } = useFriend(userId);
	const { blocked, revalid: blockedRevalid } = useBlocked(userId);

	function handleClose(e: any) {
		if (e.target.classList.contains("modal-background")) onClose();
	}

	async function addFriend() {
		try {
			await axios.post(`friend`, { userId });
			window.alert(`${userData.name} is added`);
			revalid();
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}
	async function deleteFriend() {
		try {
			await axios.delete(`friend/${userId}`,);
			window.alert(`${userData.name} is deleted`);
			revalid();
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}

	async function blockUser() {
		try {
			await axios.post(`blocked`, { userId });
			window.alert(`${userData.name} is blocked`);
			blockedRevalid();
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}
	async function unblockUser() {
		try {
			await axios.delete(`blocked/${userId}`,);
			window.alert(`${userData.name} is unblocked`);
			blockedRevalid();
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
						<Avatar url={userData.imageURL} status={userData.status} size="lg" />
						{userData.id !== user.id && (
							<div className="btn-cont d-flex center column gap">
								{/*<div className="d-flex center gap">
									{
										userData.id !== friend?.id
											? <div className="btn d-flex center" onClick={addFriend}>
												<FontAwesomeIcon className="svg-icon" icon="user-plus" />
											</div>
											: <div className="btn d-flex center" onClick={deleteFriend}>
												<FontAwesomeIcon icon="user-minus" />
											</div>
									}
									{
										userData.id !== blocked?.id
											? <div className="btn d-flex center" onClick={blockUser}>
												<FontAwesomeIcon icon="ban" />
											</div>
											: <div className="btn d-flex center" onClick={unblockUser}>
												<FontAwesomeIcon icon="lock-open" />
											</div>
									}
								</div>
								<div className="d-flex center gap">
									<div className="btn d-flex center">
										<FontAwesomeIcon icon="location-arrow" />
									</div>
									<div className="btn d-flex center">
										<FontAwesomeIcon icon="gamepad" />
									</div>
								</div>*/}
								<div className="d-flex center gap">
									{
										userData.id !== friend?.id
											? <button className="btn" onClick={addFriend}>Add</button>
											: <button className="btn" onClick={deleteFriend}>Delete</button>
									}
									{
										userData.id !== blocked?.id
											? <button className="btn" onClick={blockUser}>Block</button>
											: <button className="btn" onClick={unblockUser}>Unblock </button>
									}
								</div>
								<div className="d-flex center gap">
									<button className="btn">DM</button>
									<button className="btn">Play</button>
								</div>
							</div>
						)}
					</div>
					<div className="user-info">
						<h3>{userData.name}</h3>
						<div className="d-flex column gap">
							<div className="d-flex justify-between">
								<span>Email</span>
								<span>{userData.email}</span>
							</div>
							<div className="d-flex justify-between">
								<span>Created at</span>
								<span>{new Date(userData.createdAt).toLocaleDateString()}</span>
							</div>
							<div className="d-flex justify-between">
								<span>Rank</span>
								<span>{userData.rank ? userData.rank : "not yet"}</span>
							</div>
						</div>
					</div>
				</div>
			)}
			<style jsx>{`
				/*.btn-cont {
					width:10rem;
				}
				.btn-cont .d-flex {
					font-size:1.2rem;
				}
				.btn {
					width:2.6rem;
					height:2.6rem;
					border-radius:50%;
					background-color:var(--gray-light-2)
				}
				.btn:hover {
					color:white;
					background-color:var(--gray-dark);
				}*/
				.btn {
					width:7rem;
				}
				.row {
					margin-bottom: 1rem;
				}
				h3 {
					margin-bottom: 1rem;
				}
			`}</style>
		</div>
	);
}

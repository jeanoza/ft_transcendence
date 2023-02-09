import axios from "axios";
import { useAllFriend, useFriend, useUser, useUserById } from "../../utils/hooks/swrHelper";
import { Avatar } from "../avatar";

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
	if (!user) return null;
	return (
		<div className="modal-background" onClick={handleClose}>
			{userData && (
				<div className="modal-container">
					<div className="row d-flex justify-between gap">
						<Avatar url={userData.imageURL} status={userData.status} size="lg" />
						{userData.id !== user.id && (
							<div className="btn-cont d-flex center column gap">
								<div className="d-flex center justify-between gap">
									{
										userData.id !== friend?.id
											? <button onClick={addFriend}>Add</button>
											: <button onClick={deleteFriend}>Delete</button>
									}
									<button>Block</button>
								</div>
								<div className="d-flex center justify-between gap">
									<button>DM</button>
									<button>Play</button>
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
				.btn-cont > .d-flex {
					width: 100%;
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

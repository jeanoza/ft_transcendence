import axios from "axios";
import React, { useEffect, useState } from "react";
import { useUser } from "../../utils/hooks/swrHelper";

export function UserModal({
	userId,
	onClose,
}: {
	userId: number | null;
	onClose: any;
}) {
	const [userData, setUserData] = useState<any>(null);
	const { user } = useUser();
	useEffect(() => {
		async function getUserData() {
			try {
				const res = await axios.get(`user/${userId}`);
				setUserData(res.data);
			} catch (e) {
				console.log(e);
			}
		}
		getUserData();
	}, []);
	function handleClose(e: any) {
		if (e.target.classList.contains("modal-background")) onClose();
	}
	return (
		<div className="modal-background" onClick={handleClose}>
			{userData && (
				<div className="modal-container">
					<div className="row d-flex justify-between gap">
						<div
							className="avatar"
							style={{
								backgroundImage: `url(${userData.imageURL})`,
							}}
						>
							<div className="status offline"></div>
						</div>
						{userData.id !== user.id && (
							<div className="btn-cont d-flex center column gap">
								<div className="d-flex center justify-between gap">
									<button>Add</button>
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

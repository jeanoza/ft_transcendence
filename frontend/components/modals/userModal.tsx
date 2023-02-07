import axios from "axios"
import { useEffect, useState } from "react"

export function UserModal({ userId, onClose }: { userId: number | null, onClose: any }) {
	const [userData, setUserData] = useState<any>(null)
	useEffect(() => {
		async function getUserData() {
			try {
				const res = await axios.get(`user/${userId}`)
				setUserData(res.data);
			} catch (e) {
				console.log(e);
			}
		}
		getUserData();
	}, [])
	function handleClose(e) {
		if (e.target.classList.contains('modal-background')) onClose();
	}
	//console.log(userData);
	return <div className="modal-background" onClick={handleClose} >
		{userData && (
			<div className="modal-container">
				<div className="row d-flex justify-between">
					<div
						className="avatar"
						style={{
							backgroundImage: `url(${userData.imageURL})`
						}}
					></div>
					<div className="btn-cont d-flex center justify-end gap">
						<button>Add</button>
						<button>DM</button>
						<button>Play</button>
					</div>
				</div>
				<div className="user-info">
					<h3>{userData.name}</h3>
					<div className="d-flex column gap">
						<div className="d-flex justify-between">
							<span>Email</span>
							<span>
								{userData.email}
							</span>
						</div>
						<div className="d-flex justify-between">
							<span>Created at</span>
							<span>{new Date(userData.createdAt).toLocaleDateString()}</span>
						</div>
						<div className="d-flex justify-between">
							<span>Rank</span>
							<span>
								{userData.rank ? userData.rank : "not yet"}
							</span>
						</div>
					</div>
				</div>
			</div>
		)}
		<style jsx>{`
			.avatar {
				width: 10rem;
				height: 10rem;
				border-radius:1rem;
				margin:1rem;
			}
			.btn-cont{
				width: 240px;
			}
			.row {
				margin-bottom:1rem;
			}
			.user-info {
				background-color:rgb(240,240,240);
				border-radius:8px;
				color:#424245;
				padding:1rem;
				font-weight:500;
			}
			h3 {
				margin-bottom:1rem;
			}
		`}</style>
	</div >
}
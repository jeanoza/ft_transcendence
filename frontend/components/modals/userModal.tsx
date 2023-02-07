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
	console.log(userData);
	return <div className="modal-background">
		{userData && (
			<div className="modal-container">
				<h3>{userData.name}</h3>
				<div
					className="avatar"
					style={{
						backgroundImage: `url(${userData.imageURL ? userData.imageURL : "/default_profile.png"
							})`,
					}}
				/>
				<button onClick={onClose}>close</button>
			</div>
		)}
		<style jsx>{`
			.avatar {
				width: 10rem;
				height: 10rem;
			}
		`}</style>
	</div>
}
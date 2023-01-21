import axios from "axios";
import { useRouter } from "next/router";

export function Profile({ user }: { user: IUser }) {
	const router = useRouter();
	async function onLogout(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			await axios.get("user/logout");
			delete axios.defaults.headers.common["Authorization"];
			router.push("/auth");
		} catch (err) {
			throw err;
		}
	}
	return (
		<div className="profile">
			<div
				className="avatar"
				style={{
					backgroundImage: `url(${user.imageURL ? user.imageURL : "/default_profile.png"
						})`,
				}}
			/>
			<span>
				{user.name}({user.email})
			</span>
			<button onClick={onLogout}>Logout</button>
			<style jsx>{`
				.profile {
					position: absolute;
					top: 0px;
					right: 16px;
					height: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					gap:8px;
				}
				.avatar {
					background-size: cover;
					width: 3rem;
					height: 3rem;
					border-radius: 50%;
					border: 1px solid white;
				}
			`}</style>
		</div>
	);
}

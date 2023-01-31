import axios from "axios";
import { useRouter } from "next/router";

export function Profile({ user }: { user: IUser }) {
	const router = useRouter();
	async function onLogout(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			await axios.get("user/logout");
			router.push("/");
		} catch (err) {
			throw err;
		}
	}
	return (
		<div className="profile d-flex justify-between">
			<div
				className="avatar"
				style={{
					backgroundImage: `url(${user.imageURL ? user.imageURL : "/default_profile.png"})`,
				}}
			/>
			<span>
				{user.name} ({user.email})
			</span>
			<button onClick={onLogout}>Logout</button>
			<style jsx>{`
				.profile {
					/*position: absolute;
					top: 0px;
					right: 16px;*/
					display: flex;
					justify-content: space-between;
					align-items: center;
					gap:1rem;
					margin-right:1rem;
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

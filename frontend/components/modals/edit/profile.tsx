import { useUser } from "../../../utils/hooks/swrHelper";

export function Profile() {
	const { user } = useUser();

	return (
		<div className="d-flex column gap">
			<div className="d-flex center gap justify-between">
				<div className="avatar"
					style={{
						backgroundImage: `url(${user.imageURL})`
					}}></div>
				<div>
					<button>Edit</button>
				</div>
			</div>
			<div className="user-info">
				<h3>{user.name}</h3>
				<div className="d-flex column gap">
					<div className="d-flex justify-between">
						<span>Email</span>
						<span>
							{user.email}
						</span>
					</div>
					<div className="d-flex justify-between">
						<span>Created at</span>
						<span>{new Date(user.createdAt).toLocaleDateString()}</span>
					</div>
					<div className="d-flex justify-between">
						<span>Rank</span>
						<span>
							{user.rank ? user.rank : "not yet"}
						</span>
					</div>
				</div>
			</div>
			<style jsx>{`
			.avatar {
				width: 10rem;
				height: 10rem;
				border-radius:1rem;
			}
			.user-info {
				min-width:240px;
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
	)
}
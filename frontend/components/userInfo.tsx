export function UserInfo({ user }: any) {
	return (
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
			<style jsx>{`
				h3 {
					margin-bottom:1rem
				}
			`}</style>
		</div>
	)
}
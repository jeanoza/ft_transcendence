const STATUS = ['offline', 'online', 'ingame']

export function Avatar({ url, status, size }: { url: string, status?: number, size?: string }) {
	return (
		<div className={`avatar ${size ? size : ''}`} style={{ backgroundImage: `url(${url})` }
		}>
			<div className={`status ${status ? STATUS[status] : 'offline'}`} />
			<style jsx>{`
				.avatar {
					position: relative;
					background-size: cover;
					border: 1px solid white;
					width: 7rem;
					height: 7rem;
					border-radius: 50%;
				}
				.avatar.lg {
					width: 10rem;
					height: 10rem;
					border-radius: 1rem;
				}
				.avatar.sm {
					width: 3rem;
					height: 3rem;
				}
				.avatar.sm > .status{
					bottom:0;
					right:0;
				}
				.status {
					position: absolute;
					bottom: 0.5rem;
					right: 0.5rem;
					width: 1rem;
					height: 1rem;
					border: 1px solid white;
					border-radius: 50%;
				}
				.status.online {
					background-color: chartreuse;
				}
				.status.offline {
					background-color: red;
				}
				.status.ingame {
					background-color: orange;
				}
		`}</style>
		</div >
	)
}
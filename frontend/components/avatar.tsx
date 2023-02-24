//status 0 | null ? => offline
const STATUS = ["offline", "online", "ingame"];

export function Avatar({
	url,
	status,
	size,
	children,
}: {
	url?: string;
	status?: number;
	size?: string;
	children?: any;
}) {
	return (
		<div
			className={`avatar ${size ? size : ""}`}
			style={{ backgroundImage: `url(${url})` }}
		>
			{status === null && <div className="status offline" />}
			{status && <div className={`status ${STATUS[status]}`} />}
			{children}
			<style jsx>{`
				.avatar {
					position: relative;
					background-size: cover;
					border: 1px solid white;
					min-width: 7rem;
					width: 7rem;
					height: 7rem;
					border-radius: 50%;
				}
				.avatar.lg {
					min-width: 10rem;
					width: 10rem;
					height: 10rem;
					border-radius: 1rem;
				}
				.avatar.sm {
					min-width: 3rem;
					width: 3rem;
					height: 3rem;
				}
				.avatar.sm > .status {
					bottom: 0;
					right: 0;
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
		</div>
	);
}

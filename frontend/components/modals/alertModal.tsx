import { Avatar } from "../avatar";

export function AlertModal({ refuseUser, text, onCancel }: {
	refuseUser?: IUser;
	text: string;
	onCancel: any;
}) {
	return (
		<div className="modal-background">
			<div className="modal-container">
				{refuseUser && (
					<div className="d-flex center justify-start gap">
						<Avatar url={refuseUser.imageURL} size="sm" />
						<h3>{refuseUser.name}</h3>
					</div>
				)}
				<div className="my-4">{text}</div>
				<div className="d-flex center gap">
					<button onClick={onCancel}>Cancel</button>
				</div>
			</div>
		</div>
	);
}

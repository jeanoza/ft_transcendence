import { Avatar } from "../avatar";

export function ConfirmModal({ inviteUser, text, onAccept, onCancel }: {
	inviteUser?: IUser;
	text: string;
	onAccept: any;
	onCancel: any;
}) {
	return (
		<div className="modal-background">
			<div className="modal-container">
				{inviteUser && (
					<div className="d-flex center justify-start gap">
						<Avatar url={inviteUser.imageURL} size="sm" />
						<h3>{inviteUser.name}</h3>
					</div>
				)}
				<div className="my-4">{text}</div>
				<div className="d-flex center gap">
					<button onClick={onAccept}>OK</button>
					<button onClick={onCancel}>Cancel</button>
				</div>
			</div>
		</div>
	);
}

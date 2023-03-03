import { useRouter } from "next/router";
import { useSocket } from "../../utils/hooks/useSocket";

export function ConfirmModal({ title, text, onAccept, onCancel }: { text: string }) {

	return (
		<div className="modal-background">
			<div className="modal-container">
				<h3>{title}</h3>
				<div>
					<span>{text}</span>
				</div>
				<div className="d-flex justify-end gap">
					<button onClick={onCancel}>Cancel</button>
				</div>
			</div>
		</div>
	);
}

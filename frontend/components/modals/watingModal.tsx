import { useRouter } from "next/router";
import { useSocket } from "../../utils/hooks/useSocket";

export function WaitingModal() {
	const { socket } = useSocket("game");
	const router = useRouter();

	function onClose() {
		socket.emit("leaveGameWithoutName");

		if (router.pathname === "/game") router.push("/");
	}

	return (
		<div className="modal-background">
			<div className="modal-container">
				<h3>Wating</h3>
				<div className="d-flex justify-end gap">
					<button onClick={onClose}>Cancel</button>
				</div>
			</div>
		</div>
	);
}

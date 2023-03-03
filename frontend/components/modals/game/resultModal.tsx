import { useRouter } from "next/router";
import { useSocket } from "../../../utils/hooks/useSocket";

export function ResultModal({
	role,
	roomName,
	children,
}: {
	roomName: string;
	role: number;
	children: any;
}) {
	const { socket } = useSocket("game");
	const router = useRouter();

	function onWait() {
		socket.emit("onWait", { roomName });
	}

	function onQuit() {
		socket.emit("leaveGame", { roomName, role });
		router?.push("/");
	}

	return (
		<div className="modal-background">
			<div className="modal-container column d-flex center gap">
				{children}
				<div className="my-4">
					<span>Do you want one more match with current user?</span>
				</div>
				<div className="d-flex justify-end gap">
					<button onClick={onWait}>Yes</button>
					<button onClick={onQuit}>No</button>
				</div>
			</div>
		</div>
	);
}

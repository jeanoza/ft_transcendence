import { useEffect, useState } from "react";
import { useSocket } from "../../utils/hooks/useSocket"
import { WaitingModal } from "../modals/index/waitingModal";
import { useUser } from "../../utils/hooks/swrHelper";
import { useRouter } from "next/router";

export function PlayButton() {
	const { socket } = useSocket("game");
	const { socket: chatSocket } = useSocket("chat")
	const { user } = useUser();
	const [openWaitingModal, setWaitingModal] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		socket.on("foundRandomMatch", ({ roomName, role }) => {
			router.push("/game");
			socket.emit("joinRandomMatch", { roomName, role })
		})
		return () => {
			socket.off("foundRandomMatch")
		}
	}, [])


	function handlePlay() {
		socket.emit('addWaiting', { userId: user.id })
		// to prevent invite user when the user is waiting random match
		chatSocket.emit("updateStatus", { userId: user.id, status: 2 })
		setWaitingModal(true);
	}
	function handleCancelWaiting() {
		socket.emit('deleteWaiting', { userId: user.id })
		chatSocket.emit("updateStatus", { userId: user.id, status: 1 })
		setWaitingModal(false);
	}
	return <div className="d-flex center justify-end play-button-container">
		<button onClick={handlePlay}>Play</button>
		{openWaitingModal && <WaitingModal onClose={handleCancelWaiting} />}
		<style jsx>{`
			.play-button-container {
				margin-top: 1rem;
			}
		`}</style>
	</div>
}
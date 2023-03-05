import { useEffect, useState } from "react";
import { use2fa, useUser } from "../utils/hooks/swrHelper";
import { useSocket } from "../utils/hooks/useSocket";
import { Loader } from "./loader";
import { Navbar } from "./navbar";
import { useRouter } from "next/router";
import axios from "axios";
import { ConfirmModal } from "./modals/confirmModal";
import { AlertModal } from "./modals/alertModal";

let userConnected = false;

interface IGame {
	refuseUser: IUser;
	inviteUser: IUser;
	senderId: number;
	receiverId: number;
	roomName: string;
}

export function AuthLayout({ children }: React.PropsWithChildren) {
	const { user, revalid, isLoading } = useUser();
	const { socket: chatSocket } = useSocket("chat");
	const { socket: gameSocket } = useSocket("game");
	const { isLoading: is2faLoading } = use2fa();
	const [openConfirmModal, setConfirmModal] = useState<boolean>(false);
	const [openAlertModal, setAlertModal] = useState<boolean>(false);
	const [roomName, setRoomName] = useState<string | null>(null);
	const [inviteUser, setInviteUser] = useState<IUser | null>(null);
	const [refuseUser, setRefuseUser] = useState<IUser | null>(null);
	const router = useRouter();

	useEffect(() => {
		updateStatus();
		async function updateStatus() {
			try {
				const _user = (await axios.get("user/current")).data;
				let status = 1;
				if (router.pathname === "/game") status = 2;
				else gameSocket.emit("leaveGamePage", { userId: _user.id });

				chatSocket.emit("updateStatus", { userId: _user.id, status });
			} catch (e) {
				console.log(e);
			}
		}
	}, [router]);

	useEffect(() => {
		//update chat socket
		if (user && !userConnected) {
			chatSocket.emit("connectUser", user.id);
			gameSocket.emit("connectUser", user.id);
			userConnected = true;
		}
	}, [user]);

	useEffect(() => {
		chatSocket.on("updatedStatus", function () {
			revalid();
		});
		gameSocket.on("invitedGame", function ({ inviteUser, roomName }: IGame) {
			setRoomName(roomName);
			setConfirmModal(true);
			setInviteUser(inviteUser);
		});
		gameSocket.on("acceptedGame", function ({ roomName }) {
			router?.push("/game");
		});
		gameSocket.on("refusedGame", function ({ refuseUser, roomName }: IGame) {
			setAlertModal(true);
			setRefuseUser(refuseUser);
			gameSocket.emit("leaveGame", { roomName });
		});
		gameSocket.on(
			"makeLeaveGame",
			function ({ role, roomName }: { role: number; roomName: string }) {
				gameSocket.emit("leaveGame", { role, roomName });
			}
		);

		return () => {
			gameSocket.off("invitedGame");
			gameSocket.off("acceptedGame");
			gameSocket.off("refusedGame");
			gameSocket.off("makeLeaveGame");
			chatSocket.off("connected");
		};
	}, []);

	function onCloseConfirmModal() {
		setInviteUser(null);
		setRoomName(null);
		setConfirmModal(false);
	}
	function onAccept() {
		gameSocket.emit("acceptGame", { roomName });
		onCloseConfirmModal();
	}
	function onCancelInvite() {
		gameSocket.emit("refuseGame", { refuseUser: user, roomName });
		onCloseConfirmModal();
	}
	function onCloseRefuseModal() {
		setRefuseUser(null);
		setAlertModal(false);
	}

	if (isLoading || is2faLoading)
		return (
			<div className="container">
				<Loader />
			</div>
		);
	return (
		<div className="container">
			<Navbar />
			{user && children}
			{openConfirmModal && inviteUser && (
				<ConfirmModal
					inviteUser={inviteUser}
					text="Do you accept to join to game?"
					onAccept={onAccept}
					onCancel={onCancelInvite}
				/>
			)}
			{openAlertModal && refuseUser && (
				<AlertModal
					refuseUser={refuseUser}
					text="The user refused your invite"
					onCancel={onCloseRefuseModal}
				/>
			)}
			<style jsx global>{`
				.container {
					height: 100vh;
				}
				main {
					margin: 1rem auto;
					width: 50%;
					height: calc(100vh - 64px);
					min-width: 400px;
					border-radius: 8px;
				}
				@media screen and (max-width: 1024px) {
					main {
						width: 100%;
						height: calc(100vh - 48px);
						margin: 0 0;
						padding: 1rem;
					}
				}
			`}</style>
		</div>
	);
}

export function Layout({ children }: React.PropsWithChildren) {
	return (
		<div className="container">
			{children}
			<style jsx global>{`
				.container {
					height: 100vh;
				}
				main {
					margin: 2rem auto;
					width: 50%;
					height: calc(100vh - 96px);
					min-width: 400px;
					border-radius: 8px;
				}
				@media screen and (max-width: 1024px) {
					main {
						width: 100%;
						height: calc(100vh - 48px);
						margin: 0 0;
						padding: 1rem;
					}
				}
			`}</style>
		</div>
	);
}

import { useEffect } from "react";
import { use2fa, useUser } from "../utils/hooks/swrHelper";
import { useSocket } from "../utils/hooks/useSocket";
import { Loader } from "./loader";
import { Navbar } from "./navbar";
import { useRouter } from "next/router";

let userConnected = false;

interface IGame {
	senderId: number;
	receiverId: number;
	name: string;
}

export function AuthLayout({ children }: React.PropsWithChildren) {
	const { user, revalid, isLoading } = useUser();
	const { socket: chatSocket } = useSocket("chat");
	const { socket: gameSocket } = useSocket("game");
	const { isLoading: is2faLoading } = use2fa();
	const router = useRouter();

	useEffect(() => {
		//update chat socket
		if (user && !userConnected) {
			chatSocket.emit("connectUser", user.id);
			gameSocket.emit("connectUser", user.id);
			userConnected = true;
			chatSocket.on("connected", function () {
				console.log("connected chat socket");
				revalid();
			});
			//FIXME: need to clean up or not?
			return () => {
				chatSocket.off("connected");
			};
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			gameSocket.on("invitedGame", function ({ name }: IGame) {
				if (window.confirm("Do you accept to join to game?"))
					gameSocket.emit("acceptGame", { name });
				else gameSocket.emit("refuseGame", { name });
			});
			gameSocket.on("acceptedGame", function ({ name }) {
				router.push("/game");
			});
			gameSocket.on("refusedGame", function ({ name }: IGame) {
				window.alert("The user refused your invite");
				gameSocket.emit("leaveGame", { name });
			});
			gameSocket.on("ownerLeft", function () {
				window.alert("The game owner is already left");
			});

			return () => {
				gameSocket.off("invitedGame");
				gameSocket.off("acceptedGame");
				gameSocket.off("refusedGame");
				gameSocket.off("ownerLeft");
			};
		}

	}, [user])

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

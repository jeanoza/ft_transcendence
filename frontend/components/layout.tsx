import axios from "axios";
import { useEffect } from "react";
import { use2fa, useUser } from "../utils/hooks/swrHelper";
import { useSocket } from "../utils/hooks/useSocket";
import { Loader } from "./loader";
import { Navbar } from "./navbar";

let userConnected = false;

export function AuthLayout({ children }: React.PropsWithChildren) {
	const { user, revalid, isLoading } = useUser();
	const { socket: chatSocket } = useSocket("chat");
	//const { socket: gameSocket } = useSocket("game");
	const { isLoading: is2faLoading } = use2fa();

	useEffect(() => {
		//update chat socket
		if (user && !userConnected) {
			chatSocket.emit("connectUser", user.id);
			userConnected = true;
			chatSocket.on("connected", function () {
				revalid();
			});
			return () => {
				chatSocket.off("connected");
			};
		}
	}, [user]);

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

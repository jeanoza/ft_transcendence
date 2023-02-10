import axios from "axios";
import { useEffect } from "react";
import {
	use2fa,
	useAllBlocked,
	useAllFriend,
	useAllUser,
	useUser,
} from "../utils/hooks/swrHelper";
import { useSocket } from "../utils/hooks/useSocket";
import { Loader } from "./loader";
import { Navbar } from "./navbar";

enum STATUS {
	online = 1,
	ingame,
}

export function AuthLayout({ children }: React.PropsWithChildren) {
	const { user, revalid, isLoading } = useUser();
	const { friends, revalid: revalidFriends } = useAllFriend();
	const { users, revalid: revalidUsers } = useAllUser();
	const { blockeds, revalid: revalidBlockeds } = useAllBlocked();
	const { socket } = useSocket("chat");
	const { isLoading: is2faLoading } = use2fa();

	useEffect(() => {
		socket.on("come", async function () {
			setTimeout(() => {
				revalidFriends(friends);
				revalidUsers(users);
				revalidBlockeds(blockeds);
			}, 200);
		});
		return () => {
			socket.off("come");
		};
	}, [friends, users, blockeds]);

	useEffect(() => {
		//update chat socket
		if (user) {
			socket.on("connect", async function () {
				await axios.patch(`user/${user.id}`, {
					status: STATUS.online,
					chatSocket: socket.id,
				});
				revalid(user);
			});
			socket.on("quit", function (data) {
				revalidFriends(friends);
				revalidUsers(users);
				revalidBlockeds(blockeds);
			});
		}
		return () => {
			socket.off("connect");
			socket.off("quit");
		};
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

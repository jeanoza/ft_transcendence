import { Seo } from "../components/seo";
import { AuthLayout } from "../components/layout";
import { useEffect, useState } from "react";
import Pong from "../components/pong";
import { Loader } from "../components/loader";
import { WaitingModal } from "../components/modals/watingModal";
import { useUser } from "../utils/hooks/swrHelper";
import { useSocket } from "../utils/hooks/useSocket";
import axios from "axios";
import { Avatar } from "../components/avatar";

export function getServerSideProps({ req }: any) {
	const accessToken = req.cookies["accessToken"] || null;
	if (!accessToken) {
		return {
			redirect: {
				permanent: false,
				destination: "/auth",
			},
			props: {},
		};
	}
	return { props: {} };
}
export default function Game() {
	const [isLoading, setLoading] = useState<boolean>(true);
	const { socket } = useSocket("game");
	const [home, setHome] = useState<IUser | null>(null);
	const [away, setAway] = useState<IUser | null>(null);

	useEffect(() => {
		socket.on("roomInfo", async ({ homeId, awayId }) => {
			console.log("[roomInfo] ", "homeId:", homeId, "awayId: ", awayId);
			await axios.get("user/" + homeId).then((res) => setHome(res.data));
			await axios.get("user/" + awayId).then((res) => setAway(res.data));
			setLoading(false);
		});
		return () => {
			socket.off("roomInfo");
		};
	}, []);

	return (
		<AuthLayout>
			<Seo title="Game" />
			<main className="d-flex column center">
				{isLoading && <Loader />}
				{home && away && (
					<div className="user-board d-flex center justify-between px-4">
						<div className="user d-flex column center">
							<h2 className="py-2">Home</h2>
							<Avatar url={home.imageURL} />
							<h3 className="text-overflow py-2">{home.name}</h3>
						</div>
						<div className="user d-flex column center">
							<h2 className="py-2">Away</h2>
							<Avatar url={away.imageURL} />
							<h3 className="text-overflow py-2">{away.name}</h3>
						</div>
					</div>
				)}
				<Pong />
				{/*<TwoPlayerPong />*/}
			</main>
			<style jsx>{`
				.user-board {
					width: 600px;
					border: 1px solid var(--border-color);
					margin-bottom: 1rem;
					border-radius: 8px;
				}
				.user {
					max-width: 7rem;
				}
			`}</style>
		</AuthLayout>
	);
}

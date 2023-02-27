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
import { UserBoard } from "../components/game/userBoard";

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
	const { user } = useUser();
	const { socket } = useSocket("game");
	const [home, setHome] = useState<IUser | null>(null);
	const [away, setAway] = useState<IUser | null>(null);
	const [isHomeReady, setHomeReady] = useState<boolean>(false);
	const [isAwayReady, setAwayReady] = useState<boolean>(false);
	const [name, setName] = useState<string | null>(null);

	useEffect(() => {
		socket.on("roomInfo", async ({ homeId, awayId, name }) => {
			console.log(
				"[roomInfo] ",
				"homeId:",
				homeId,
				"awayId: ",
				awayId,
				"name: ",
				name
			);
			setName(name);
			await axios.get("user/" + homeId).then((res) => setHome(res.data));
			await axios.get("user/" + awayId).then((res) => setAway(res.data));
			setLoading(false);
		});
		socket.on("homeReady", (ready) => {
			setHomeReady(ready);
		});
		socket.on("awayReady", (ready) => {
			setAwayReady(ready);
		});
		return () => {
			socket.off("roomInfo");
			socket.off("homeReady");
			socket.off("awayReady");
		};
	}, []);

	function handleReady() {
		if (user.id === home?.id)
			socket.emit("ready", { name, home: !isHomeReady });
		else if (user.id === away?.id)
			socket.emit("ready", { name, away: !isAwayReady });
	}

	return (
		<AuthLayout>
			<Seo title="Game" />
			<main className="d-flex column center">
				{isLoading && <Loader />}
				{home && away && (
					<UserBoard
						home={home}
						away={away}
						isHomeReady={isHomeReady}
						isAwayReady={isAwayReady}
						handleReady={handleReady} />
				)}
				<Pong allPlayerReady={isHomeReady && isAwayReady ? true : false} />
			</main >
			<style jsx>{`
				
			`}</style>
		</AuthLayout >
	);
}

import { Seo } from "../components/seo";
import { AuthLayout } from "../components/layout";
import { useCallback, useEffect, useState } from "react";
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
	const [isHome, setIsHome] = useState<boolean | null>(null);
	const [homeId, setHomeId] = useState<number | null>(null)
	const [awayId, setAwayId] = useState<number | null>(null)

	const [homePaddlePos, setHomePaddlePos] = useState<number>(0);
	const [awayPaddlePos, setAwayPaddlePos] = useState<number>(0);

	const BALL_SIZE = 20;
	const PADDLE_WIDTH = 10;
	const PADDLE_HEIGHT = 80;
	const GAME_WIDTH = 600;
	const GAME_HEIGHT = 400;
	const GAME_AREA = GAME_WIDTH * GAME_HEIGHT;



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
			//setHomeId(homeId);
			//setAwayId(awayId);
			await axios.get("user/current").then((res) => setIsHome(res.data.id == homeId))
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
		socket.on("updatedPaddle", ({ isHome, paddlePos }) => {
			if (isHome) setHomePaddlePos(paddlePos);
			else setAwayPaddlePos(paddlePos);
		})

		const handleKeyDown = (e: any) => {
			console.log(homeId, awayId)
			if (e.code === "ArrowUp") {
				if (isHome)
					socket.emit("updateHomePaddle", { channelName: name, paddlePos: Math.max(homePaddlePos - 20, 0) })
				else
					socket.emit("updateAwayPaddle", { channelName: name, paddlePos: Math.max(awayPaddlePos - 20, 0) })
			}
			else if (e.code === "ArrowDown") {
				if (isHome)
					socket.emit("updateHomePaddle", { channelName: name, paddlePos: Math.min(homePaddlePos + 20, GAME_HEIGHT - PADDLE_HEIGHT) })
				else
					socket.emit("updateAwayPaddle", { channelName: name, paddlePos: Math.min(awayPaddlePos + 20, GAME_HEIGHT - PADDLE_HEIGHT) })
			}
		};

		window.addEventListener("keydown", handleKeyDown);


		return () => {
			socket.off("roomInfo");
			socket.off("homeReady");
			socket.off("awayReady");
			socket.off("updatedPaddle");
			window.removeEventListener("keydown", handleKeyDown);

		};
	}, [homePaddlePos, awayPaddlePos]);

	function handleReady() {
		//if (user.id === home?.id)
		if (isHome !== null) {
			if (isHome)
				socket.emit("ready", { name, home: !isHomeReady });
			//else if (user.id === away?.id)
			else
				socket.emit("ready", { name, away: !isAwayReady });
		}
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
						handleReady={handleReady}
					/>
				)}
				{/*<Pong allPlayerReady={isHomeReady && isAwayReady ? true : false} isHome={isHome} />*/}
				<div className="pong">
					<div className="paddle home" style={{ top: homePaddlePos, left: 0 }} />
					<div className="paddle away" style={{ top: awayPaddlePos, right: 0 }} />
				</div>
			</main >
			<style jsx>{`
				.pong {
					position: relative;
					width: 600px;
					height: 400px;
					background: black;
					margin: 0 auto;
					overflow: hidden;
				}
				.paddle {
					position: absolute;
					width: 10px;
					height: 80px;
					background: white;
				}
				/*.paddle.home,
				.paddle.away{
					top:160px;
				}*/


			`}</style>
		</AuthLayout >
	);
}

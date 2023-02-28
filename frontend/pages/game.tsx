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

enum ROLE {
	Observer,
	Home,
	Away,
}

export default function Game() {
	const [isLoading, setLoading] = useState<boolean>(true);
	const { user } = useUser();
	const { socket } = useSocket("game");
	const [home, setHome] = useState<IUser | null>(null);
	const [away, setAway] = useState<IUser | null>(null);
	const [isHomeReady, setHomeReady] = useState<boolean>(false);
	const [isAwayReady, setAwayReady] = useState<boolean>(false);
	const [roomName, setRoomName] = useState<string | null>(null);
	const [role, setRole] = useState<ROLE>(ROLE.Observer);

	const [homePaddlePos, setHomePaddlePos] = useState<number>(0);
	const [awayPaddlePos, setAwayPaddlePos] = useState<number>(0);

	const BALL_SIZE = 20;
	const PADDLE_WIDTH = 10;
	const PADDLE_HEIGHT = 80;
	const GAME_WIDTH = 600;
	const GAME_HEIGHT = 400;
	const GAME_AREA = GAME_WIDTH * GAME_HEIGHT;

	useEffect(() => {
		//socket.on("roomInfo", async ({ homeId, awayId, roomName }) => {
		socket.on("roomInfo", async (roomName) => {
			const [nsp, homeId, awayId] = roomName.split("-");
			console.log(
				"[roomInfo] ",
				"homeId:",
				homeId,
				"awayId: ",
				awayId,
				"roomName: ",
				roomName
			);
			setRoomName(roomName);
			await axios.get("user/current").then((res) => {
				const {
					data: { id },
				} = res;
				if (id == homeId) setRole(ROLE.Home);
				else if (id == awayId) setRole(ROLE.Away);
			});
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
		socket.on("updatedPaddle", ({ role, paddlePos }) => {
			if (role === ROLE.Home) setHomePaddlePos(paddlePos);
			else if (role === ROLE.Away) setAwayPaddlePos(paddlePos);
		});

		return () => {
			socket.off("roomInfo");
			socket.off("homeReady");
			socket.off("awayReady");
			socket.off("updatedPaddle");
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: any) => {
			if (role !== ROLE.Observer) {
				let paddlePos = homePaddlePos;
				if (role === ROLE.Away) paddlePos = awayPaddlePos;
				if (e.code === "ArrowUp") {
					socket.emit("updatePaddle", {
						role,
						roomName,
						paddlePos: Math.max(paddlePos - 20, 0),
					});
				} else if (e.code === "ArrowDown") {
					socket.emit("updatePaddle", {
						role,
						roomName,
						paddlePos: Math.min(paddlePos + 20, GAME_HEIGHT - PADDLE_HEIGHT),
					});
				}
			}
		};
		if (role !== ROLE.Observer) {
			window.addEventListener("keydown", handleKeyDown);
			return () => {
				//clean up event
				window.removeEventListener("keydown", handleKeyDown);
			};
		}
	}, [role, homePaddlePos, awayPaddlePos]);

	function handleReady() {
		if (role === ROLE.Home || role === ROLE.Away) {
			const ready = role === ROLE.Home ? !isHomeReady : !isAwayReady;
			socket.emit("ready", { roomName, role, ready });
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
					/>
				)}
				{/*<Pong allPlayerReady={isHomeReady && isAwayReady ? true : false} isHome={isHome} />*/}
				<div className="pong">
					<div
						className="paddle home"
						style={{ top: homePaddlePos, left: 0 }}
					/>
					<div
						className="paddle away"
						style={{ top: awayPaddlePos, right: 0 }}
					/>
					{role !== ROLE.Observer && (
						<button className="readyBtn" onClick={handleReady}>
							Ready
						</button>
					)}
				</div>
			</main>
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
				.readyBtn {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			`}</style>
		</AuthLayout>
	);
}

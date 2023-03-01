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

enum PADDLE_MOVE {
	Up = 1,
	Down
}

interface BallPos {
	x: number;
	y: number;
}
interface BallDir {
	x: number;
	y: number;
}

interface RoomInfo {
	roomName: string;
	home: IUser;
	away: IUser;
	isHomeReady: boolean;
	isAwayReady: boolean;
	homePaddlePos: number;
	awayPaddlePos: number;
	ballPos: BallPos;
	ballDir: BallDir;
}

const BALL_SIZE = 20;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const GAME_AREA = GAME_WIDTH * GAME_HEIGHT;

export default function Game() {
	const [isLoading, setLoading] = useState<boolean>(true);
	const { socket } = useSocket("game");
	const [home, setHome] = useState<IUser | null>(null);
	const [away, setAway] = useState<IUser | null>(null);
	const [roomName, setRoomName] = useState<string | null>(null);
	const [role, setRole] = useState<ROLE>(ROLE.Observer);

	const [isHomeReady, setHomeReady] = useState<boolean>(false);
	const [isAwayReady, setAwayReady] = useState<boolean>(false);
	const [homePaddlePos, setHomePaddlePos] = useState<number | null>(null);
	const [awayPaddlePos, setAwayPaddlePos] = useState<number | null>(null);
	const [ballPos, setBallPos] = useState<BallPos | null>(null);
	const [ballDir, setBallDir] = useState<BallDir | null>(null);




	useEffect(() => {
		const handleKeyDown = (e: any) => {
			if (role !== ROLE.Observer) {
				let paddlePos = role === ROLE.Home ? homePaddlePos : awayPaddlePos;
				if (e.code === "ArrowUp") {
					socket.emit("updatePaddle", {
						role,
						roomName,
						paddlePos,
						move: PADDLE_MOVE.Up
					});
				} else if (e.code === "ArrowDown") {
					socket.emit("updatePaddle", {
						role,
						roomName,
						paddlePos,
						move: PADDLE_MOVE.Down
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
	}, [isLoading, homePaddlePos, awayPaddlePos, role]);


	useEffect(() => {
		socket.on("updateRole", (role: ROLE) => {
			setRole(role);
		})
		socket.on("roomInfo", ({
			roomName,
			home,
			away,
			isHomeReady,
			isAwayReady,
			homePaddlePos,
			awayPaddlePos,
			ballPos,
			ballDir
		}: RoomInfo) => {
			setRoomName(roomName)
			setHome(home);
			setAway(away);
			setHomeReady(isHomeReady)
			setAwayReady(isAwayReady)
			setHomePaddlePos(homePaddlePos);
			setAwayPaddlePos(awayPaddlePos);
			setBallPos(ballPos);
			setBallDir(ballDir);

			setLoading(false)
		})
		return () => {
			socket.off("roomInfo");
			socket.off("updateRole");
		};
	}, []);



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
				{/*<Pong allPlayerReady={isHomeReady && isAwayReady ? true : false} />*/}
				<div className="pong">
					{homePaddlePos !== null &&
						<div
							className="paddle home"
							style={{ top: homePaddlePos, left: 0 }}
						/>
					}
					{awayPaddlePos !== null &&
						<div
							className="paddle away"
							style={{ top: awayPaddlePos, right: 0 }}
						/>
					}
					{ballPos !== null && ballDir !== null &&
						<div
							className="ball"
							style={{
								top: ballPos.y,
								left: ballPos.x,
							}}
						/>
					}
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
				.ball {
					position: absolute;
					width: 20px;
					height: 20px;
					background: white;
					border-radius: 50%;
				}
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

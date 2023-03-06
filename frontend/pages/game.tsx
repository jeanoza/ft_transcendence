import { Seo } from "../components/seo";
import { AuthLayout } from "../components/layout";
import { useEffect, useState } from "react";
import { Loader } from "../components/loader";
import { useSocket } from "../utils/hooks/useSocket";
import { UserBoard } from "../components/game/userBoard";
import { ResultModal } from "../components/modals/game/resultModal";
import { useRouter } from "next/router";
import { AlertModal } from "../components/modals/alertModal";

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
	Down,
}

enum GAME_STATUS {
	Waiting = 1,
	Playing,
	End,
}

interface BallPos {
	x: number;
	y: number;
}
interface BallDir {
	x: number;
	y: number;
}
interface Score {
	home: number;
	away: number;
}
interface Ready {
	home: boolean;
	away: boolean;
}

interface PaddlePos {
	home: number;
	away: number;
}

interface RoomInfo {
	roomName: string;
	home: IUser;
	away: IUser;
	ready: Ready;
	paddlePos: PaddlePos;
	ballPos: BallPos;
	ballDir: BallDir;
	score: Score;
	status: GAME_STATUS;
	winner: IUser | null;
}

export default function Game() {
	const [isLoading, setLoading] = useState<boolean>(true);
	const { socket } = useSocket("game");
	const [home, setHome] = useState<IUser | null>(null);
	const [away, setAway] = useState<IUser | null>(null);
	const [roomName, setRoomName] = useState<string | null>(null);
	const [role, setRole] = useState<ROLE>(ROLE.Observer);
	const [status, setStatus] = useState<GAME_STATUS>(GAME_STATUS.Waiting);
	const [winner, setWinner] = useState<IUser | null>(null);
	const router = useRouter();

	const [ready, setReady] = useState<Ready>({ home: false, away: false });
	const [paddlePos, setPaddlePos] = useState<PaddlePos | null>(null);
	const [ballPos, setBallPos] = useState<BallPos | null>(null);
	const [ballDir, setBallDir] = useState<BallDir | null>(null);
	const [score, setScore] = useState<Score | null>(null);

	const [openAlertModal, setAlertModal] = useState<boolean>(false);

	useEffect(() => {
		const handleKeyDown = (e: any) => {
			if (
				role !== ROLE.Observer &&
				(e.code === "ArrowUp" || e.code === "ArrowDown")
			) {
				socket.emit("updatePaddle", {
					role,
					roomName,
					move: e.code === "ArrowUp" ? PADDLE_MOVE.Up : PADDLE_MOVE.Down,
				});
			}
		};
		if (role !== ROLE.Observer) {
			window.addEventListener("keydown", handleKeyDown);
			return () => {
				//clean up event
				window.removeEventListener("keydown", handleKeyDown);
			};
		}
	}, [isLoading, paddlePos, role]);

	useEffect(() => {
		socket.on("enterRoom", ({ role, roomName }) => {
			setRole(role);
			socket.emit("startInterval", { roomName });
			setLoading(false);
		});
		socket.on(
			"roomInfo",
			({
				roomName,
				home,
				away,
				ready,
				status,
				paddlePos,
				ballPos,
				ballDir,
				score,
				winner,
			}: RoomInfo) => {
				setRoomName(roomName);
				if (!home || !away) setAlertModal(true);
				setHome(home);
				setAway(away);
				if (ready.home && ready.away)
					socket.emit("startInterval", { roomName });
				setReady(ready);
				setStatus(status);
				setPaddlePos(paddlePos);
				setBallPos(ballPos);
				setBallDir(ballDir);
				setScore(score);
				setWinner(winner);
			}
		);
		return () => {
			socket.off("roomInfo");
			socket.off("enterRoom");
		};
	}, []);

	function handleReady() {
		if (role !== ROLE.Observer) {
			const _ready = { ...ready };
			if (role === ROLE.Home) _ready.home = !ready.home;
			else if (role === ROLE.Away) _ready.away = !ready.away;
			socket.emit("ready", { roomName, ready: _ready });
		}
	}

	function onCancelAlert() {
		setAlertModal(false);
		socket.emit("leaveGame", { roomName });
		router?.push("/");
	}

	return (
		<AuthLayout>
			<Seo title="Game" />
			<main className="d-flex column center">
				{isLoading && <Loader />}
				<UserBoard home={home} away={away} ready={ready} score={score} />
				<div className="pong">
					{paddlePos !== null && (
						<>
							<div
								className="paddle home"
								style={{ top: paddlePos?.home, left: 0 }}
							/>
							<div
								className="paddle away"
								style={{ top: paddlePos?.away, right: 0 }}
							/>
						</>
					)}
					{ballPos !== null && ballDir !== null && (
						<div
							className="ball"
							style={{
								top: ballPos.y,
								left: ballPos.x,
							}}
						/>
					)}
					{role && (role === ROLE.Home || role === ROLE.Away) && status !== GAME_STATUS.Playing && (
						<button className="readyBtn" onClick={handleReady}>
							Ready
						</button>
					)}
					{roomName &&
						score &&
						winner &&
						role !== undefined &&
						role !== ROLE.Observer &&
						status === GAME_STATUS.End && (
							<ResultModal roomName={roomName} role={role}>
								<h2>Winner : {winner.name}</h2>
								<h2>
									{score.home} : {score.away}
								</h2>
							</ResultModal>
						)}
					{openAlertModal && (
						<AlertModal
							text="A player has leaved. You will redirect to home"
							onCancel={onCancelAlert}
						/>
					)}
				</div>
			</main>
			<style jsx>{`
				.pong {
					position: relative;
					width: 600px;
					height: 400px;
					background: black;
					margin: 0;
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

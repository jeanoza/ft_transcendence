import { Seo } from "../components/seo";
import { AuthLayout } from "../components/layout";
import { useEffect, useState } from "react";
import { Loader } from "../components/loader";
import { useSocket } from "../utils/hooks/useSocket";
import { UserBoard } from "../components/game/userBoard";
import { ResultModal } from "../components/modals/game/resultModal";
import { useRouter } from "next/router";
import { AlertModal } from "../components/modals/alertModal";
import { Set } from "typescript";
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


//const MAP = [
//	"/",
//	"/maps/tennis.jpeg",
//	"/maps/galaxy.jpeg",
//	"/maps/assembly.jpeg",
//	"/maps/order.jpeg",
//	"/maps/federation.jpeg",
//	"/maps/alliance.jpeg",
//]

const MAP = [
	"default",
	"tennis",
	"galaxy",
	"assembly",
	"order",
	"federation",
	"alliance",
]

export default function Game() {
	const [isLoading, setLoading] = useState<boolean>(true);
	const { socket } = useSocket("game");
	const [home, setHome] = useState<IUser | null>(null);
	const [away, setAway] = useState<IUser | null>(null);
	const [roomName, setRoomName] = useState<string | null>(null);
	const [role, setRole] = useState<ROLE>(ROLE.Observer);
	const [status, setStatus] = useState<GAME_STATUS>(GAME_STATUS.Waiting);
	const [winner, setWinner] = useState<IUser | null>(null);
	const [mapIndex, setMapIndex] = useState<number>(0);
	const router = useRouter();

	const [ready, setReady] = useState<Ready>({ home: false, away: false });
	const [paddlePos, setPaddlePos] = useState<PaddlePos | null>(null);
	const [ballPos, setBallPos] = useState<BallPos | null>(null);
	const [ballDir, setBallDir] = useState<BallDir | null>(null);
	const [score, setScore] = useState<Score | null>(null);
	const [observers, setObservers] = useState<IUser[]>([])

	const [openAlertModal, setAlertModal] = useState<boolean>(false);

	//console.log(observers)

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
		socket.on("updateObservers", async (observerIds: number[]) => {
			if (observerIds.length) {
				const _observers: IUser[] = await Promise.all(
					observerIds.map(async (observerId) =>
						axios.get("user/" + observerId).then(res => res.data)
					));
				setObservers(_observers);
			} else setObservers([]);
		});
		return () => {
			socket.off("roomInfo");
			socket.off("enterRoom");
			socket.off("updateObservers");
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
			<main className="d-flex center gap">
				{isLoading && <Loader />}
				<div>
					<UserBoard home={home} away={away} ready={ready} score={score} />
					{/*<div className="pong" style={map === 0 ? { backgroundColor: "black" } : { backgroundImage: `url(${MAP[map]})` }}>*/}
					<div className={`pong ${MAP[mapIndex]}`}>
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
					</div>
				</div>
				<div className="right-pannel p-2">
					<div className="quit-container d-flex center justify-end">
						<button onClick={() => router?.push("/")}>Quit</button>
					</div>
					<div className="map-container">
						<h3>Maps</h3>
						<ul className="my-4">
							{MAP.map((mapName, index) => {
								let liClassName = "p-1"
								let mapClassName = "map "
								if (index === mapIndex)
									liClassName += " selected";
								mapClassName += mapName;
								return <li key={index} className={liClassName} onClick={() => setMapIndex(index)}>
									<div className={mapClassName} />
								</li>
							})}
						</ul>
					</div>
					<div className="observers-container my-4">
						<h3>Observers({observers?.length})</h3>
						<ul className="my-4">
							{observers?.map(observer => {
								return <li key={observer.id} className="d-flex center justify-start gap">
									<Avatar size="sm" url={observer.imageURL} />
									<span className="text-overflow">{observer.name}</span>
								</li>
							}
							)}
						</ul>
					</div>
				</div>
			</main>
			{
				roomName &&
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
				)
			}
			{
				openAlertModal && (
					<AlertModal
						text="A player has leaved. You will redirect to home"
						onCancel={onCancelAlert}
					/>
				)
			}
			<style jsx>{`
				.pong {
					position: relative;
					width: 600px;
					height: 400px;
					margin: 0;
					overflow: hidden;
					background-size: cover;
					background-position:center;
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
				.right-pannel {
					margin: 2rem 0;
					height:560px;
					border:1px solid var(--border-color);
					border-radius:8px;
				}
				.observers-container ul{
					width:16rem;

				}
				.observers-container li{
					width:16rem;
				}
				.map-container {
				}
				.map-container ul{
					display: grid;
   			 	grid-template-columns: repeat(auto-fill, 7.5rem);
    			gap: 1rem;
					
				}
				.map-container li{
					position:relative;
					width:7.5rem;
					height:5rem;
					border-radius:8px;
					border:1px solid var(--border-color);
				}
				.map-container li.selected{
					border:2px solid var(--bg-accent);
				}
				.map-container li:hover > .map{
					transform:scale(1.05);
					transition:all 0.2s linear;
				}
				.map {
					width:100%;
					height:100%;
					background-size: cover;
					background-position:center;
				}
				.default {
					background-color:black;
				}
				.tennis {
					background-image:url('/maps/tennis.jpeg')
				}
				.galaxy {
					background-image:url('/maps/galaxy.jpeg')
				}
				.assembly {
					background-image:url('/maps/assembly.jpeg')
				}
				.order {
					background-image:url('/maps/order.jpeg')
				}
				.federation {
					background-image:url('/maps/federation.jpeg')
				}
				.alliance {
					background-image:url('/maps/alliance.jpeg')
				}
			`}</style>
		</AuthLayout >
	);
}

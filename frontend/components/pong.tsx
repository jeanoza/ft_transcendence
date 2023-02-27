import React, { useState, useRef, useEffect } from "react";

const Pong = ({ allPlayerReady, isHome }: { allPlayerReady: boolean, isHome: boolean }) => {
	const [score, setScore] = useState({
		player1: 0,
		player2: 0,
	});
	const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
	const [ballDirection, setBallDirection] = useState({ x: 1, y: 1 });
	const [paddle1Position, setPaddle1Position] = useState(0);
	const [paddle2Position, setPaddle2Position] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const gameBoardRef = useRef(null);

	const BALL_SIZE = 20;
	const PADDLE_WIDTH = 10;
	const PADDLE_HEIGHT = 80;
	const GAME_WIDTH = 600;
	const GAME_HEIGHT = 400;
	const GAME_AREA = GAME_WIDTH * GAME_HEIGHT;

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.code === "KeyW") {
				setPaddle1Position((paddle1Position) =>
					Math.max(paddle1Position - 20, 0)
				);
			} else if (event.code === "KeyS") {
				setPaddle1Position((paddle1Position) =>
					Math.min(paddle1Position + 20, GAME_HEIGHT - PADDLE_HEIGHT)
				);
			} else if (event.code === "ArrowUp") {
				setPaddle2Position((paddle2Position) =>
					Math.max(paddle2Position - 20, 0)
				);
			} else if (event.code === "ArrowDown") {
				setPaddle2Position((paddle2Position) =>
					Math.min(paddle2Position + 20, GAME_HEIGHT - PADDLE_HEIGHT)
				);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			//window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (!allPlayerReady || gameOver) {
				clearInterval(intervalId);
				return;
			}

			const nextX = ballPosition.x + ballDirection.x * 5;
			const nextY = ballPosition.y + ballDirection.y * 5;

			// Check for collision with walls
			if (nextX < 0 || nextX > GAME_WIDTH - BALL_SIZE) {
				setBallDirection((ballDirection) => ({
					x: -ballDirection.x,
					y: ballDirection.y,
				}));
			}
			if (nextY < 0 || nextY > GAME_HEIGHT - BALL_SIZE) {
				setBallDirection((ballDirection) => ({
					x: ballDirection.x,
					y: -ballDirection.y,
				}));
			}

			// Check for collision with paddles
			if (
				(nextX < PADDLE_WIDTH &&
					nextY >= paddle1Position &&
					nextY <= paddle1Position + PADDLE_HEIGHT) ||
				(nextX > GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
					nextY >= paddle2Position &&
					nextY <= paddle2Position + PADDLE_HEIGHT)
			) {
				setBallDirection((ballDirection) => ({
					x: -ballDirection.x,
					y: ballDirection.y,
				}));
			}

			// Check for scoring
			if (nextX < 0) {
				setScore((score) => ({
					player1: score.player1 + 1,
					player2: score.player2,
				}));

				setBallPosition({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
				setBallDirection({ x: 1, y: 1 });
			}
			if (nextX > GAME_WIDTH - BALL_SIZE) {
				setScore((score) => ({
					player1: score.player1,
					player2: score.player2 + 1,
				}));
				setBallPosition({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
				setBallDirection({ x: -1, y: -1 });
			}

			setBallPosition({ x: nextX, y: nextY });
		}, 25);

		return () => {
			clearInterval(intervalId);
		};
	}, [ballPosition, ballDirection, gameOver, allPlayerReady]);

	const winner =
		score.player1 >= 5 ? "Player 1" : score.player2 >= 5 ? "Player 2" : null;

	return (
		<div className="Pong" ref={gameBoardRef}>
			<div
				className="Paddle Paddle1"
				style={{ top: paddle1Position, left: 0 }}
			/>
			<div
				className="Paddle Paddle2"
				style={{ top: paddle2Position, right: 0 }}
			/>
			<div
				className="Ball"
				style={{
					top: ballPosition.y,
					left: ballPosition.x,
					background: winner ? "gray" : "white",
				}}
			/>
			{winner && (
				<div className="GameOver">
					<h2>{winner} wins!</h2>
					<button onClick={() => setGameOver(true)}>Restart</button>
				</div>
			)}
			<div className="Score">
				<div className="PlayerScore">{score.player1}</div>
				<div className="PlayerScore">{score.player2}</div>
			</div>
			<style jsx>{`
				.Pong {
					position: relative;
					width: 600px;
					height: 400px;
					background: black;
					margin: 0 auto;
					overflow: hidden;
				}
				.Paddle {
					position: absolute;
					width: 10px;
					height: 80px;
					background: white;
				}

				.Paddle1 {
					top: 160px;
				}

				.Paddle2 {
					top: 160px;
				}

				.Ball {
					position: absolute;
					width: 20px;
					height: 20px;
					background: white;
					border-radius: 50%;
				}

				.Score {
					position: absolute;
					top: 20px;
					left: 50%;
					transform: translateX(-50%);
					display: flex;
					justify-content: space-between;
					width: 100px;
					color: white;
					font-size: 32px;
				}

				.PlayerScore {
					font-weight: bold;
				}

				.GameOver {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					text-align: center;
					width: 200px;
					background: white;
					padding: 20px;
					border-radius: 10px;
				}

				.GameOver h2 {
					margin-top: 0;
					margin-bottom: 20px;
					color: gray;
				}

				.GameOver button {
					display: block;
					margin: 0 auto;
					padding: 10px 20px;
					font-size: 16px;
					border: none;
					background: gray;
					color: white;
					border-radius: 5px;
					cursor: pointer;
				}

				.GameOver button:hover {
					background: darkgray;
				}
			`}</style>
		</div>
	);
};

export default Pong;

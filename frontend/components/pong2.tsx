import React, { useState, useEffect } from "react";

const BOARD_WIDTH = 600;
const BOARD_HEIGHT = 400;
const BALL_SIZE = 10;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 5;
const INITIAL_BALL_SPEED = 5;
const BALL_SPEED_INCREMENT = 1;

const Ball = ({ x, y }) => {
	return <div className="ball" style={{ top: y, left: x }} />;
};

const Paddle = ({ y, side }) => {
	const paddleStyle = side === "left" ? { left: 0 } : { right: 0 };
	return <div className="paddle" style={{ top: y, ...paddleStyle }} />;
};

const ReadyButton = ({ onClick, ready }) => {
	return (
		<button className="ready-button" onClick={onClick}>
			{ready ? "Not Ready" : "Ready"}
		</button>
	);
};

const TwoPlayerPong = () => {
	const [ballX, setBallX] = useState(BOARD_WIDTH / 2);
	const [ballY, setBallY] = useState(BOARD_HEIGHT / 2);
	const [ballSpeed, setBallSpeed] = useState(INITIAL_BALL_SPEED);
	const [ballAngle, setBallAngle] = useState(Math.random() * 120 + 30);
	const [leftPaddleY, setLeftPaddleY] = useState(
		(BOARD_HEIGHT - PADDLE_HEIGHT) / 2
	);
	const [rightPaddleY, setRightPaddleY] = useState(
		(BOARD_HEIGHT - PADDLE_HEIGHT) / 2
	);
	const [leftScore, setLeftScore] = useState(0);
	const [rightScore, setRightScore] = useState(0);
	const [leftReady, setLeftReady] = useState(false);
	const [rightReady, setRightReady] = useState(false);

	const handleTick = () => {
		// Calculate new ball position
		const ballDeltaX = Math.cos((ballAngle * Math.PI) / 180) * ballSpeed;
		const ballDeltaY = Math.sin((ballAngle * Math.PI) / 180) * ballSpeed;
		const newBallX = ballX + ballDeltaX;
		const newBallY = ballY + ballDeltaY;

		// Check for collisions with top/bottom walls
		if (newBallY < 0 || newBallY > BOARD_HEIGHT - BALL_SIZE) {
			setBallAngle(-ballAngle);
		}

		// Check for scoring
		if (newBallX < 0) {
			setBallAngle(180 - ballAngle);
			setBallSpeed(INITIAL_BALL_SPEED);
			setRightScore((prevScore) => prevScore + 1);
			setBallX(BOARD_WIDTH / 2);
			setBallY(BOARD_HEIGHT / 2);
			setBallAngle(Math.random() * 120 + 30);
		}
		if (newBallX > BOARD_WIDTH - BALL_SIZE) {
			setBallAngle(180 - ballAngle);
			setBallSpeed(INITIAL_BALL_SPEED);
			setLeftScore((prevScore) => prevScore + 1);
			setBallX(BOARD_WIDTH / 2);
			setBallY(BOARD_HEIGHT / 2);
			setBallAngle(Math.random() * 120 + 210);
		}

		// Check for collisions with paddles

		const leftPaddleX = 0;
		const rightPaddleX = BOARD_WIDTH - PADDLE_WIDTH;
		if (
			(newBallX < leftPaddleX + PADDLE_WIDTH &&
				newBallX + BALL_SIZE > leftPaddleX &&
				newBallY < leftPaddleY + PADDLE_HEIGHT &&
				newBallY + BALL_SIZE > leftPaddleY) ||
			(newBallX < rightPaddleX + PADDLE_WIDTH &&
				newBallX + BALL_SIZE > rightPaddleX &&
				newBallY < rightPaddleY + PADDLE_HEIGHT &&
				newBallY + BALL_SIZE > rightPaddleY)
		) {
			setBallAngle(180 - ballAngle);
			setBallSpeed((prevSpeed) => prevSpeed + BALL_SPEED_INCREMENT);
		}

		// Update ball position
		setBallX(newBallX);
		setBallY(newBallY);
	};

	useEffect(() => {
		// Move the ball every frame
		const intervalId = setInterval(handleTick, 16);
		return () => clearInterval(intervalId);
	}, [ballX, ballY, ballSpeed, ballAngle]);

	const handleKeyDown = (event) => {
		if (event.key === "w") {
			setLeftPaddleY((prevY) => Math.max(0, prevY - PADDLE_SPEED));
		}
		if (event.key === "s") {
			setLeftPaddleY((prevY) =>
				Math.min(BOARD_HEIGHT - PADDLE_HEIGHT, prevY + PADDLE_SPEED)
			);
		}
		if (event.key === "ArrowUp") {
			setRightPaddleY((prevY) => Math.max(0, prevY - PADDLE_SPEED));
		}
		if (event.key === "ArrowDown") {
			setRightPaddleY((prevY) =>
				Math.min(BOARD_HEIGHT - PADDLE_HEIGHT, prevY + PADDLE_SPEED)
			);
		}
	};

	const handleReadyLeft = () => {
		setLeftReady((prev) => !prev);
	};

	const handleReadyRight = () => {
		setRightReady((prev) => !prev);
	};

	useEffect(() => {
		if (leftReady && rightReady) {
			// Both players are ready, start the game
			setBallX(BOARD_WIDTH / 2);
			setBallY(BOARD_HEIGHT / 2);
			setBallSpeed(INITIAL_BALL_SPEED);
			setBallAngle(Math.random() * 120 + 30);
			setLeftScore(0);
			setRightScore(0);
		}
	}, [leftReady, rightReady]);

	return (
		<div className="board" tabIndex={0} onKeyDown={handleKeyDown}>
			<div className="scoreboard">
				<div className="score">{leftScore}</div>
				<div className="score">{rightScore}</div>
			</div>
			<Ball x={ballX} y={ballY} />
			<Paddle y={leftPaddleY} side="left" />
			<Paddle y={rightPaddleY} side="right" />
			<ReadyButton onClick={handleReadyLeft} ready={leftReady} />
			<ReadyButton onClick={handleReadyRight} ready={rightReady} />
			<style jsx>{`
				.board {
					width: 600px;
					height: 400px;
					position: relative;
					border: 2px solid black;
					margin: 0 auto;
					display: flex;
					align-items: center;
					justify-content: center;
					font-family: sans-serif;
				}

				.scoreboard {
					display: flex;
					justify-content: space-between;
					position: absolute;
					top: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 80px;
					height: 40px;
					background-color: white;
					border: 2px solid black;
					border-radius: 10px;
					font-size: 30px;
					font-weight: bold;
					color: black;
				}

				.score {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 40px;
					height: 40px;
				}

				.ball {
					width: 20px;
					height: 20px;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					background-color: black;
					border-radius: 50%;
				}

				.paddle {
					width: 10px;
					height: 60px;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					background-color: black;
				}

				.paddle.left {
					left: 0;
				}

				.paddle.right {
					right: 0;
				}

				.ready-button {
					position: absolute;
					bottom: 10px;
					width: 100px;
					height: 50px;
					background-color: #1a1a1a;
					color: white;
					border: none;
					border-radius: 5px;
					font-size: 18px;
					font-weight: bold;
					cursor: pointer;
					transition: background-color 0.2s;
				}

				.ready-button:hover {
					background-color: #333;
				}
			`}</style>
		</div>
	);
};

export default TwoPlayerPong;

import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSocket } from "../utils/hooks/useSocket";

function Pong() {
	const [ballPosition, setBallPosition] = useState({ x: 290, y: 190 });
	const [paddle1Position, setPaddle1Position] = useState(160);
	const [paddle2Position, setPaddle2Position] = useState(160);
	const { socket } = useSocket("game");
	const [score1, setScore1] = useState(0);
	const [score2, setScore2] = useState(0);

	useEffect(() => {
		socket.on("update", (data) => {
			setBallPosition(data.ballPosition);
			setPaddle1Position(data.paddle1Position);
			setPaddle2Position(data.paddle2Position);
			setScore1(data.score1);
			setScore2(data.score2);
		});
	}, []);

	const handleKeyDown = (e) => {
		if (e.keyCode === 38) {
			socket.emit("move", "up");
		} else if (e.keyCode === 40) {
			socket.emit("move", "down");
		}
	};

	return (
		<div className="board" onKeyDown={handleKeyDown} tabIndex={0}>
			<div className="paddle left" style={{ top: paddle1Position }}></div>
			<div className="paddle right" style={{ top: paddle2Position }}></div>
			<div
				className="ball"
				style={{ top: ballPosition.y, left: ballPosition.x }}
			></div>
			<div className="scoreboard">
				<div className="score">{score1}</div>
				<div className="score">{score2}</div>
			</div>
			<style jsx>{`
				.board {
					position: relative;
					width: 600px;
					height: 400px;
					border: 2px solid #fff;
					background-color: black;
				}

				.ball {
					position: absolute;
					top: 190px;
					left: 290px;
					width: 20px;
					height: 20px;
					background-color: #fff;
					border-radius: 50%;
				}

				.paddle {
					position: absolute;
					width: 10px;
					height: 80px;
					background-color: #fff;
				}

				.paddle.left {
					left: 20px;
					top: 160px;
				}

				.paddle.right {
					right: 20px;
					top: 160px;
				}

				.scoreboard {
					position: absolute;
					top: 20px;
					left: 50%;
					transform: translateX(-50%);
					font-size: 2rem;
					font-weight: bold;
				}

				.score {
					float: left;
				}

				.score {
					float: right;
				}
			`}</style>
		</div>
	);
}

export default Pong;

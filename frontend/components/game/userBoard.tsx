import { MouseEventHandler, useEffect } from "react";
import { Avatar } from "../avatar";
import { useUser } from "../../utils/hooks/swrHelper";

interface IUserBoard {
	home: IUser;
	away: IUser;
	ready: any;
	score: any;
}

export function UserBoard({
	home,
	away,
	ready,
	score
}: IUserBoard) {

	useEffect(() => { }, []);

	return (
		<div className="user-board d-flex center justify-between px-4">
			<div className="user d-flex column center">
				<h2 className="py-2">Home</h2>
				<Avatar url={home.imageURL} />
				<h3 className="text-overflow py-2">{home.name}</h3>
				{ready.home && <h2 className="ready">Ready</h2>}
			</div>
			{score && (
				<div className="d-flex gap">
					<h1>{score.home}</h1>
					<h1>:</h1>
					<h1>{score.away}</h1>
				</div>
			)}
			<div className="user d-flex column center">
				<h2 className="py-2">Away</h2>
				<Avatar url={away.imageURL} />
				<h3 className="text-overflow py-2">{away.name}</h3>
				{ready.away && <h2 className="ready">Ready</h2>}
			</div>

			<style jsx>{`
				.user-board {
					width: 600px;
					border: 1px solid var(--border-color);
					margin-bottom: 1rem;
					border-radius: 8px;
					position: relative;
				}
				.user {
					max-width: 7rem;
					position: relative;
				}
				.ready {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					color: white;
				}
			`}</style>
		</div>
	);
}

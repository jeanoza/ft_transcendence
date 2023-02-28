import { MouseEventHandler, useEffect } from "react";
import { Avatar } from "../avatar";
import { useUser } from "../../utils/hooks/swrHelper";

interface IUserBoard {
	home: IUser;
	away: IUser;
	isHomeReady: boolean;
	isAwayReady: boolean;
}

export function UserBoard({
	home,
	away,
	isHomeReady,
	isAwayReady,
}: IUserBoard) {
	const { user } = useUser();

	useEffect(() => {}, [home, away, isHomeReady, isAwayReady]);

	return (
		<div className="user-board d-flex center justify-between px-4">
			<div className="user d-flex column center">
				<h2 className="py-2">Home</h2>
				<Avatar url={home.imageURL} />
				<h3 className="text-overflow py-2">{home.name}</h3>
				{isHomeReady && <h2 className="ready">Ready</h2>}
			</div>
			<div className="user d-flex column center">
				<h2 className="py-2">Away</h2>
				<Avatar url={away.imageURL} />
				<h3 className="text-overflow py-2">{away.name}</h3>
				{isAwayReady && <h2 className="ready">Ready</h2>}
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

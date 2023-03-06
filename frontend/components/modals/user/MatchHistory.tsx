import { useAllMatchByUserId } from "../../../utils/hooks/swrHelper";
import { Avatar } from "../../avatar";

interface Match {
	score: number[];
	winner: IUser;
	loser: IUser;
	createdAt: string;
}

export function MatchHistory({ userId }: { userId: number }) {
	const { matches } = useAllMatchByUserId(userId);

	//if (!matches || matches.length === 0) return null;
	return (
		<div className="match-container">
			<h3 className="my-4">Match history</h3>
			<ul className="list">
				{matches?.length === 0 && (
					<li className="d-flex center justify-between my-2 mx-4">
						<span>Not yet</span>
					</li>
				)}
				{matches?.map((match: Match, index: string) => {
					const isWinner = match.winner.id === userId ? true : false;
					const _score = match.score;
					const score = _score[0] + " : " + _score[1];
					return (
						<li key={index} className="d-flex center justify-between my-2 mx-4">
							<div className="d-flex column center">
								<Avatar size="sm" url={match.winner.imageURL} />
								<h4 className="text-overflow">{match.winner.name}</h4>
							</div>
							<h3>VS</h3>
							<div className="d-flex column center">
								<Avatar size="sm" url={match.loser.imageURL} />
								<h4 className="text-overflow">{match.loser.name}</h4>
							</div>
							<div className="d-flex column center">
								<h3>{score}</h3>
								{isWinner
									? <span className="text won">Won</span>
									: <span className="text lost">Lost</span>
								}
							</div>
							<span className="date">
								{new Date(match.createdAt).toLocaleString()}
							</span>
						</li>
					);
				})}
			</ul>
			<style jsx>{`
				.match-container {
					/*margin*/
				}
				.list {
					background-color: var(--gray-light-1);
					border-radius: 8px;
					max-height: 200px;
					overflow-y: auto;
				}
				.text-overflow {
					width: 5rem;
					text-align: center;
				}
				.text {
					margin:auto;
					font-weight:500;
				}
				.text.won {
					color: var(--accent);
				}
				.text.lost {
					color: red;
				}
				.date {
					width:5rem;
				}
			`}</style>
		</div>
	);
}

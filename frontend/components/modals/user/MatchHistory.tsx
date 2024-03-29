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
					const vs = isWinner ? match.loser : match.winner;
					return (
						<li key={index} className="d-flex center justify-between my-2 mx-4">
							<h3>VS</h3>
							<div className="d-flex column center">
								<Avatar size="sm" url={vs.imageURL} />
								<h4 className="text-overflow">{vs.name}</h4>
							</div>
							<div className="d-flex column center">
								<h3>{score}</h3>
								{isWinner
									? <h4 className="text won">Won</h4>
									: <h4 className="text lost">Lost</h4>
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
				}
				.text.won {
					color: var(--accent);
				}
				.text.lost {
					color: red;
				}
				.date {
					width:7rem;
					text-align:center;
				}
			`}</style>
		</div>
	);
}

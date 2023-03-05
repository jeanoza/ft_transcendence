import { useAllMatchByUserId } from "../../../utils/hooks/swrHelper";
import { Avatar } from "../../avatar";

interface Match {
	score: number[];
	winner: IUser;
	loser: IUser;
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
					const _score = match.score;
					const score =
						_score[0] > _score[1]
							? _score[0] + " : " + _score[1]
							: _score[1] + " : " + _score[0];
					return (
						<li key={index} className="d-flex center justify-between my-2 mx-4">
							<Avatar size="sm" url={match.winner.imageURL}>
								<h3 className="text won">Won</h3>
							</Avatar>
							<span className="text-overflow">{match.winner.name}</span>
							<h3>{score}</h3>
							<span className="text-overflow">{match.loser.name}</span>
							<Avatar size="sm" url={match.loser.imageURL}>
								<h3 className="text lost">Lost</h3>
							</Avatar>
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
					width: 7rem;
					text-align: center;
				}
				.text {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
				.text.won {
					color: white;
				}
				.text.lost {
					color: red;
				}
			`}</style>
		</div>
	);
}

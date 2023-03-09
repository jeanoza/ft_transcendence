import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "../avatar";
import { useUser } from "../../utils/hooks/swrHelper";

export default function LeaderBoard() {
	const [leaderList, setleaderList] = useState<IUser[]>([]);
	const { user } = useUser();
	useEffect(() => {
		async function getAllUserByRank() {
			axios.get("user/rank").then((res) => {
				// use this data.
				// put it on state and do it your self what you want
				// data is already ordered by rank
				//ex: res.data[0] is highest ranker
				console.log(res.data);
				setleaderList(res.data);
			});
		}
		getAllUserByRank();
	}, []);
	return (
		<div>
			<h3
				className="my-4"
				style={{ textAlign: "center", fontFamily: "sans-serif" }}
			>
				<FontAwesomeIcon icon={"crown"} />
				<br></br>
				&nbsp; LEADER BOARD
				<br></br>
			</h3>
			<div className="boardBar p-2">
				<li>Position</li>
				<li>Photo</li>
				<li className="name-home">Name</li>
				<li>Rank</li>
			</div>
			<div className="listBox">
				<ul className="leaderboard">
					{leaderList.map((list, index) => {
						return (
							<li
								key={list.id}
								className={`tr2-home px-2 ${list.id === user.id ? "me" : ""}`}
							>
								<span>{index + 1}</span>
								<span className="image-home">
									<Avatar size="sm" url={list.imageURL} />
								</span>
								<span className="name-home">{list.name}</span>
								<span className="rank-home">{list.rank}</span>
							</li>
						);
					})}
				</ul>
			</div>

			<style jsx>{`
				h3 {
				}
				.leaderboard {
					margin-top: 5px;
					width: 100%;
				}
				.boardBar {
					margin-top: 50px;
					display: flex;
					justify-content: space-between;
					background-color: black;
					color: white;
				}
				.tr2-home {
					display: flex;
					gap: 2rem;
					/*justify-content: space-between;*/
					background-color: var(--gray-light-1);
					align-items: center;
					border-radius: 8px;
					margin-bottom: 3px;
					line-height: 30px;
					outline: solid 1px var(--gray-light-2);
				}
				.image-home {
					justify-content: center;
					vertical-align: middle;
				}
				.tr2-home.me {
					background-color: white;
				}
				.boardBar > li:not(.name-home),
				.tr2-home > span:not(.name-home) {
					width: 56px;
				}
				.name-home {
					width: 256px;
				}
			`}</style>
		</div>
	);
}

import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "../avatar";

export default function LeaderBoard() {
	const [leaderList, setleaderList] = useState<IUser[]>([]);
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
			<h3 style={{ textAlign: "center", fontFamily: "sans-serif" }}>
				<FontAwesomeIcon icon={"crown"} />
				<br></br>
				&nbsp; LEADER BOARD
				<br></br>
			</h3>
			<div className="boardBar">
				<li>Rank</li>
				<li>Photo</li>
				<li>Name</li>
				<li>Score</li>
			</div>
			<div className="listBox">
				<ul className="leaderboard">
					{leaderList.map((list, index) => {
						return (
							<li key={list.id} className="tr2-home">
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
					margin-top: 40px;
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
					padding-right: 10px;
					padding-left: 10px;
				}
				.tr2-home {
					display: flex;
					/*justify-content: space-between;*/
					background-color: var(--gray-light-1);
					padding-left: 3px;
					align-items: center;
					border-radius: 8px;
					margin-bottom: 3px;
					line-height: 30px;
					padding-left: 20px;
					outline: solid 1px var(--gray-light-2);
				}
				.image-home {
					justify-content: center;
					vertical-align: middle;
					padding-left: 100px;
				}
				.name-home {
					padding-left: 80px;
					width: 150px;
				}
				.rank-home {
					padding-left: 60px;
					width: 100px;
					padding-right: 10px;
				}
			`}</style>
		</div>
	);
}

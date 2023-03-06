import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../utils/hooks/swrHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "../avatar";

export default function LeaderBoard() {
	const { user } = useUser();
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
			<h2>Hello, {user.name}</h2>
			<h3 style={{ textAlign: "center", fontFamily: "sans-serif" }}>
				<FontAwesomeIcon icon={"crown"} />
				<br></br>
				&nbsp; LEADER BOARD
				<br></br>
			</h3>
			<div className="listBox">
				<ol start={1} className="leaderboard">
					{leaderList.map((list) => {
						return (
							<li key={list.id} className="tr2-home">
								<span className="image-home">
									<Avatar size="sm" url={list.imageURL} />
								</span>
								<span className="name-home">{list.name}</span>
								<span className="rank-home">{list.rank}</span>
							</li>
						);
					})}
				</ol>
			</div>

			<style jsx>{`
				h3 {
					margin-top: 40px;
				}
				.leaderboard {
					margin-top: 40px;
				}

				.tr2-home {
					color: black;
					font-size: small;
					display: list-item;
					list-style-position: inside;
					background-color: var(--gray-light-1);
					padding-left: 100px;
					align-items: center;
					width: 60%;
					align-position: center;
					margin-left: 300px;
					border-radius: 8px;
					margin-bottom: 10px;
					line-height: 100px;
				}
				.image-home {
					display: inline-block;
					width: 200px;
					margin-left: 50px;
					justify-content: center;
					vertical-align: middle;
				}
				li::marker {
					content: counter(list-item);
					color: black;
					font-size: 20px;
					font-size: 100%;
					color: black;
				}
				.name-home {
					display: inline-block;
					width: 200px;
					margin-left: 50px;
				}
			`}</style>
		</div>
	);
}

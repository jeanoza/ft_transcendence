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
							<li
								style={{ listStyleType: "lower-roman" }}
								key={list.id}
								className="tr2-home"
							>
								<span className="image-home">
									<Avatar size="smalls" url={list.imageURL} />
								</span>
								<span className="id-home">{list.name}</span>
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
				.listBox {
					border-radius: 8px;
					border: solid, grey;
				}

				.tr2-home {
					text-align: center;
					background-color: white;
					color: black;
					font-size: small;
					display: flex;
					align-items: center;
					justify-content: space-around;
					font-family: "sans-serif";
					padding: 10px;
					list-style-type: decimal;
				}
			`}</style>
		</div>
	);
}

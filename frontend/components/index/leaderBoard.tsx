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
				setleaderList(res.data);
			});
		}
		getAllUserByRank();
	}, []);
	return (
		<div className="leader-container">
			<div className="d-flex center column my-4">
				<FontAwesomeIcon icon={"crown"} size="lg" />
				<h2 className="my-4" >
					&nbsp; LEADER BOARD
				</h2>
			</div>
			<ul className="">
				<li className="d-flex gap header p-2">
					<span>Position</span>
					<span>Photo</span>
					<span className="name">Name</span>
					<span>Rank</span>
				</li>
				{leaderList.map((list, index) => {
					return (
						<li
							key={list.id}
							className={`d-flex gap p-2 center ${list.id === user.id ? "me" : ""}`}
						>
							<span>{index + 1}</span>
							<div className="d-flex center">
								<Avatar size="sm" url={list.imageURL} >
									{index === 0 && (
										<div className="leader">
											<FontAwesomeIcon icon={["fas", "crown"]} />
										</div>
									)}
								</Avatar>
							</div>
							<span className="name">{list.name}</span>
							<span className="">{list.rank}</span>
						</li>
					);
				})}
			</ul>
			<style jsx>{`
				.leader-container {
					width:100%;
				}
				ul {
					border:1px solid var(--border-color);
					border-top:none;
					border-radius:8px;
				}
				ul > li:last-child {
					border-radius: 0 0 8px 8px;
				}
				ul > li {
					width:100%;
					background-color: var(--gray-light-1);
				}
				ul > li.me {
					background-color: white;
				}
				ul > li.header {
					background-color: var(--gray-dark);
					border-radius:8px 8px 0 0;
					color:white;
				}
				ul > li > span {
					width:56px;
					text-align:center;
				}
				ul > li > div {
					width:56px;
				}
				.name {
					flex-grow:1;
				}
				.leader {
					position:absolute;
					color: #ffb142;
					bottom:0;
					left:0;
				}
			`}</style>
		</div>
	);
}

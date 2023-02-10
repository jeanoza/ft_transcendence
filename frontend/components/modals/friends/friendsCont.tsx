import axios from "axios";
import { useAllFriend } from "../../../utils/hooks/swrHelper";
import { Avatar } from "../../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader } from "../../loader";
import { useEffect } from "react";
import { useSocket } from "../../../utils/hooks/useSocket";

export function FriendsCont() {
	const { friends, revalid, isLoading } = useAllFriend();

	async function deleteFriend(e: any) {
		const { id } = e.currentTarget;
		try {
			await axios.delete(`friend/${id}`);
			window.alert(`user is deleted`);
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}

	async function blockFriend(e: any) {
		const { id } = e.currentTarget;
		try {
			await axios.post(`blocked`, { userId: id });
			window.alert(`user is blocked`);
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}

	if (!friends) return <Loader />;

	return (
		<div className="item-cont">
			<ul className="d-flex column">
				{friends?.map((el: any) => (
					<li key={el.id} className="d-flex center justify-between gap">
						<Avatar url={el.image_url} size="sm" status={el.status} />
						<span className="username">{el.name}</span>
						<div className="d-flex gap">
							<div id={el.id} onClick={deleteFriend}>
								<FontAwesomeIcon icon="user-minus" />
							</div>
							<div id={el.id} onClick={blockFriend}>
								<FontAwesomeIcon icon="ban" />
							</div>
						</div>
					</li>
				))}
			</ul>
			<style jsx>{`
				.username {
					width: 96px;
				}
				ul {
					gap: 0.5rem;
				}
				li {
					padding-right: 1rem;
				}
				li:hover {
					background-color: var(--gray-light-1);
					border-radius: 8px;
				}
			`}</style>
		</div>
	);
}

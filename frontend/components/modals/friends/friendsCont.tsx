import axios from "axios";
import { useAllFriend } from "../../../utils/hooks/swrHelper";
import { Avatar } from "../../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function FriendsCont() {
	const { friends } = useAllFriend();

	async function deleteFriend(e: any) {
		const { id } = e.currentTarget
		try {
			await axios.delete(`friend/${id}`,);
			window.alert(`user is deleted`);
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}
	return <div className="item-cont">
		<ul className="d-flex column">
			{friends.map((el: any) =>
				<li key={el.id} className="d-flex center justify-between gap" >
					<Avatar url={el.image_url} size="sm" />
					{el.name}
					<div id={el.id} onClick={deleteFriend}>
						<FontAwesomeIcon icon="user-minus" />
					</div>
				</li>)}
		</ul>
		<style jsx>{`
			ul {
				gap:0.5rem;
			}
			li {
				padding-right:1rem;
			}
			li:hover {
				background-color:rgb(240,240,240);
				border-radius:8px;
			}
		`}</style>
	</div>
}
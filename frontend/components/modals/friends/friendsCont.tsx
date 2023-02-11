import axios from "axios";
import { useAllFriend } from "../../../utils/hooks/swrHelper";
import { Avatar } from "../../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader } from "../../loader";

export function FriendsCont() {
	const { friends } = useAllFriend();

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
					<li key={el.id} className="d-flex center justify-between gap p-2">
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
			`}</style>
		</div>
	);
}

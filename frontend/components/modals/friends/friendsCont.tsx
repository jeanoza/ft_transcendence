import axios from "axios";
import { useAllFriend } from "../../../utils/hooks/swrHelper";
import { Avatar } from "../../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader } from "../../loader";

export function FriendsCont({ openUserModal }: { openUserModal: any }) {
	const { friends, revalid } = useAllFriend();

	async function deleteFriend(e: any, userName: string) {
		const { id } = e.currentTarget;
		try {
			if (window.confirm(`Do you want to delete ${userName}?`)) {
				await axios.delete(`friend/${id}`);
				window.alert(`user is deleted`);
				revalid();
			}
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}

	async function blockFriend(e: any, userName: string) {
		const { id } = e.currentTarget;
		try {
			if (window.confirm(`Do you want to block ${userName}?`)) {
				await axios.post(`blocked`, { userId: id });
				window.alert(`user is blocked`);
			}
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}

	if (!friends) return <Loader />;

	return (
		<div className="item-cont">
			<ul className="d-flex column">
				{friends?.map((friend: any) => (
					<li key={friend.id} className="d-flex center justify-start p-2">
						<Avatar url={friend.image_url} size="sm" status={friend.status} />
						<span className="username m-2">{friend.name}</span>
						<div className="d-flex gap icons px-2">
							<div
								className="icon-cont"
								onClick={() => openUserModal(friend.id)}
							>
								<FontAwesomeIcon icon="user" />
							</div>
							<div id={friend.id} className="iconCont" onClick={(e) => deleteFriend(e, friend.name)}>
								{/*<FontAwesomeIcon icon={["far", "trash-can"]} />*/}
								<FontAwesomeIcon icon="trash" />
							</div>
							<div id={friend.id} className="iconCont" onClick={(e) => blockFriend(e, friend.name)}>
								<FontAwesomeIcon icon="ban" />
							</div>

						</div>
					</li>
				))}
			</ul>
			<style jsx>{`
				div.iconCont:hover{
					color:var(--accent);
				}
				.username {
					width: 100%;
				}
			`}</style>
		</div>
	);
}

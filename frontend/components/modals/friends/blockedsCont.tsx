// todo: to implement blocked list

import axios from "axios";
import { useAllBlocked } from "../../../utils/hooks/swrHelper";
import { Avatar } from "../../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BlockedsCont({ openUserModal }: { openUserModal: any }) {
	const { blockeds, revalid } = useAllBlocked();

	async function unblock(e: any, userName: string) {
		const { id } = e.currentTarget;
		try {
			if (window.confirm(`Do you want to unblock ${userName}?`)) {
				await axios.delete(`blocked/${id}`);
				window.alert(`user is unblocked`);
				revalid();
			}
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}
	return (
		<div className="item-cont">
			<ul className="d-flex column">
				{blockeds?.map((blocked: any) => (
					<li key={blocked.id} className="d-flex center justify-start p-2">
						<Avatar url={blocked.image_url} size="sm" status={blocked.status} />
						<span className="username m-2">{blocked.name}</span>
						<div className="d-flex gap icons px-2">
							<div
								className="icon-cont"
								onClick={() => openUserModal(blocked.id)}
							>
								<FontAwesomeIcon icon="user" />
							</div>
							<div id={blocked.id} className="iconCont" onClick={(e) => unblock(e, blocked.name)}>
								<FontAwesomeIcon icon="lock-open" />
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

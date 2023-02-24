// todo: to implement blocked list

import axios from "axios";
import { useAllBlocked } from "../../../utils/hooks/swrHelper";
import { Avatar } from "../../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BlockedsCont() {
	const { blockeds, revalid } = useAllBlocked();

	async function unblock(e: any, userName: string) {
		const { id } = e.currentTarget;
		try {
			if (window.confirm(`Do you wanna really unblock ${userName}?`))
				await axios.delete(`blocked/${id}`);
			window.alert(`user is unblocked`);
			revalid();
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}
	return (
		<div className="item-cont">
			<ul className="d-flex column">
				{blockeds?.map((blocked: any) => (
					<li key={blocked.id} className="d-flex center gap p-2">
						<Avatar url={blocked.image_url} size="sm" status={blocked.status} />
						<span className="username">{blocked.name}</span>
						<div id={blocked.id} onClick={(e) => unblock(e, blocked.name)}>
							<FontAwesomeIcon icon="lock-open" />
						</div>
					</li>
				))}
			</ul>
			<style jsx>{`
				.username {
					width: 120px;
				}
			`}</style>
		</div>
	);
}

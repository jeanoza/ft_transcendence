
// todo: to implement blocked list

import axios from "axios";
import { useAllBlocked } from "../../../utils/hooks/swrHelper";
import { Avatar } from "../../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BlockedsCont() {
	const { blockeds } = useAllBlocked();

	async function unblock(e: any) {
		const { id } = e.currentTarget
		try {
			await axios.delete(`blocked/${id}`,);
			window.alert(`user is unblocked`);
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}
	return <div className="item-cont">
		<ul className="d-flex column">
			{blockeds?.map((el: any) =>
				<li key={el.id} className="d-flex center justify-between gap" >
					<Avatar url={el.image_url} size="sm" />
					<span className="username">
						{el.name}
					</span>
					<div id={el.id} onClick={unblock}>
						<FontAwesomeIcon icon="lock-open" />
					</div>
				</li>)}
		</ul>
		<style jsx>{`
			.username {
				width:120px;
			}
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
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserModal } from "./modals/userModal";
import { FriendsModal } from "./modals/friendsModal";
import { useUsers } from "../utils/hooks/swrHelper";

interface IUser {
	id: number;
	name: string;
}

export function Search() {
	const { users } = useUsers();
	const [name, setName] = useState<string>("");
	const [filtered, setFiltered] = useState<IUser[] | null>(null);
	const [openUserModal, setUserModal] = useState<boolean>(false);
	const [userId, setUserId] = useState<number | null>(null);

	useEffect(() => {
		if (name.length > 2) {
			const res: IUser[] = users.filter((el: { id: number; name: string }) =>
				//search whatever his case(upper or lower)
				el.name.toLowerCase().includes(name.toLowerCase())
			);
			if (JSON.stringify(res) != JSON.stringify(filtered)) setFiltered(res);
		} else setFiltered(null);
	}, [name]);

	function handleCancelBtn() {
		setFiltered(null);
		setName("");
	}

	async function handleOpenModal(id: number) {
		setUserId(id);
		setUserModal(true);
		setName("");
		setFiltered([]);
	}

	function onChange(e: any) {
		setName(e.target.value);
	}
	return (
		<div className="search d-flex center justify-start gap">
			<FontAwesomeIcon icon="magnifying-glass" />
			<input value={name} onChange={onChange} placeholder="search" />
			{filtered && (
				<div className="cancelBtn" onClick={handleCancelBtn}>
					<FontAwesomeIcon icon="xmark" />
				</div>
			)}
			{filtered && (
				<ul className="user-list">
					{filtered.map((el: any) => (
						<li key={el.id} onClick={() => handleOpenModal(el.id)}>
							{el?.name}
						</li>
					))}
				</ul>
			)}
			{openUserModal && userId && (
				<UserModal userId={userId} onClose={() => setUserModal(false)} />
			)}
			<style jsx>{`
				.search {
					position: relative;
					width: 160px;
					cursor: pointer;
				}
				input {
					background-color: #424245;
					color: white;
					border: none;
					outline: none;
				}
				.user-list {
					position: absolute;
					top: 30px;
					left: 0;
					right: 0;
					color: #424245;
					background: white;
					border: 1px solid rgb(200, 200, 200);
					border-top: none;
					border-radius: 0 0 8px 8px;
				}
				.cancelBtn {
					position: absolute;
					top: 2px;
					right: 2px;
				}
				li {
					padding: 0.5rem;
				}
				li:last-child {
					border-radius: 0 0 8px 8px;
				}
				li:hover {
					background-color: rgb(200, 200, 200);
					color: white;
				}
			`}</style>
		</div>
	);
}

import { User } from "./navbar/user";
import { PageList } from "./navbar/pageList";
import { Search } from "./search";
import { UserModal } from "./modal/userModal";
import { useState } from "react";

export function Navbar() {
	const [modalOpen, setModalOpen] = useState<boolean>(true);
	return (
		<nav className="d-flex center justify-between">
			<Search />
			<PageList />
			<User />
			{modalOpen && <UserModal />}
			<style jsx>{`
				nav {
					background-color: #424245;
					color: rgba(200, 200, 200, 0.92);
					width: 100%;
					position: relative;
					padding: 0px 2rem;
				}
			`}</style>
		</nav>
	);
}

import { User } from "./navbar/user";
import { PageList } from "./navbar/pageList";
import { Search } from "./search";

export function Navbar() {
	return (
		<nav className="d-flex center justify-between">
			<Search />
			<PageList />
			<User />
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

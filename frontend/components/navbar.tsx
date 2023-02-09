import { Setting } from "./navbar/setting";
import { PageList } from "./navbar/pageList";
import { Search } from "./search";

export function Navbar() {
	return (
		<nav className="d-flex center justify-between">
			<Search />
			<PageList />
			<Setting />
			<style jsx>{`
				nav {
					background-color: var(--gray-dark);
					color: var(--nav-font-color);
					width: 100%;
					position: relative;
					padding: 0px 2rem;
				}
			`}</style>
		</nav>
	);
}

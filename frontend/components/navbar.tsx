import { Profile } from "./navbar/profile";
import { PageList } from "./navbar/pageList";

export function Navbar() {
	return (
		<nav className="d-flex center">
			<PageList />
			<Profile />
			<style jsx>{`
				nav {
					background-color: #424245;
					color: rgba(200, 200, 200, 0.92);
					width: 100%;
					position: relative;
				}
			`}</style>
		</nav>
	);
}

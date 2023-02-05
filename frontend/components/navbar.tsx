import { useUser } from "../utils/hooks/swrHelper";
import { Profile } from "./navbar/profile";
import { PageList } from "./navbar/pageList";

const navbarStyles = `
	nav {
		background-color: #424245;
		color: rgba(200, 200, 200, 0.92);
		width:100%;
		position:relative;
	}
`;

export function Navbar() {
	return (
		<nav className="d-flex center">
			<PageList />
			<Profile />
			<style jsx>{`
				${navbarStyles}
			`}</style>
		</nav>
	);
}

export function NotAuthNavbar() {
	return (
		<nav>
			<PageList />
			<style jsx>{navbarStyles}</style>
		</nav>
	);
}

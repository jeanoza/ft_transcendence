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
	nav > ul {
		display: flex;
		justify-content: center;
	}
	nav > ul > li {
		display: block;
		padding: 16px;
	}
	nav > ul > li:hover {
		color: white;
	}
	nav .active {
		color: white;
	}`;

export function Navbar() {
	const { user } = useUser();

	return (
		<nav>
			<PageList />
			{user && <Profile user={user} />}
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

import { useUser } from "../utils/hooks/useUser";
import { Profile } from "./navbar/profile";
import { PageList } from "./navbar/pageList";

const navbarStyles = `
	nav {
		background-color: #424245;
		color: rgba(200, 200, 200, 0.92);
		position: fixed;
		top:0px;
		width:100%;
	}
	ul {
		display: flex;
		justify-content: center;
	}
	ul li {
		display: block;
		padding: 16px;
	}
	ul li:hover {
		color: white;
	}
	.active {
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

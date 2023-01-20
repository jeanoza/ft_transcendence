import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useUser } from "../utils/useUser";
import { Profile } from "./navbar/profile";

const navbarStyles = `
	nav {
		background-color: #424245;
		color: rgba(200, 200, 200, 0.92);
		position: relative;
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
	const router = useRouter();
	const { user } = useUser();

	const elements = ["/", "/about"];

	return (
		<nav>
			<ul>
				{elements.map((el) => {
					return (
						<li key={el}>
							<Link href={el}>
								<span className={`${router.pathname === el ? "active" : ""}`}>
									{el === "/" ? "Home" : el[1].toUpperCase() + el.slice(2)}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
			{user && <Profile user={user} />}
			<style jsx>{`
				${navbarStyles}
			`}</style>
		</nav>
	);
}

export function NotAuthNavbar() {
	const router = useRouter();
	const elements = ["/", "/about"];

	return (
		<nav>
			<ul>
				{elements.map((el) => {
					return (
						<li key={el}>
							<Link href={el}>
								<span className={`${router.pathname === el ? "active" : ""}`}>
									{el === "/" ? "Home" : el[1].toUpperCase() + el.slice(2)}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
			<style jsx>{navbarStyles}</style>
		</nav>
	);
}

import { useRouter } from "next/router";
import Link from "next/link";
import AppContext from "../utils/AppContext";
import { useContext } from "react";

//FIXME: this page will disapear.
export default function Navbar() {
	const router = useRouter();
	const elements = ["/", "/about"];

	//Can use login variable globally	thanks for React Context
	const loggedIn = useContext(AppContext).state.logged;
	const user = useContext(AppContext).state.user;

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
			<Link href="auth">
				{!loggedIn && <span className="auth">Sign In</span>}
			</Link>
			{loggedIn && (
				<span className="auth">
					{user.name} ({user.email})
				</span>
			)}
			<style jsx>{`
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
				}
				.auth {
					position: absolute;
					top: 16px;
					right: 16px;
				}
			`}</style>
		</nav>
	);
}

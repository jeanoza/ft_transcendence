import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { BASE_URL } from "../utils/global";
import { useCookies } from "react-cookie";

export default function Navbar({ user }: any) {
	const router = useRouter();
	const elements = ["/", "/about"];
	const [, , remove] = useCookies(["user"]);

	async function onClick(e) {
		await axios.get(BASE_URL + "user/logout", {
			withCredentials: true,
		});
		remove("user");
		router.push("/");
	}

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
			<div className="auth">
				{!user && (
					<Link href="auth">
						<span>Sign In</span>
					</Link>
				)}
				{user && (
					<div>
						<span>{user.email}</span>
						<button onClick={onClick}>Logout</button>
					</div>
				)}
			</div>
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
				button {
					margin-left:8px;
				}
			`}</style>
		</nav>
	);
}

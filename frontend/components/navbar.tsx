import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useEffect } from "react";

export default function Navbar({ user, revalid }: any) {
	const router = useRouter();
	const elements = ["/", "/about"];

	async function onClick(e: React.MouseEvent<HTMLButtonElement>) {
		//sessionStorage.removeItem("access_token");

		try {
			const res = await axios.get("user/logout");
			if (res) {
				sessionStorage.removeItem("access_token");
				//router.push("/");
				revalid();
			}
		} catch (e) {
			throw e;
		}
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
			{user && (
				<div className="profile">
					<span>
						{user.name}({user.email})
					</span>
					<button onClick={onClick}>Logout</button>
				</div>
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
				.profile {
					position: absolute;
					top: 16px;
					right: 16px;
				}
				button {
					margin-left: 8px;
				}
			`}</style>
		</nav>
	);
}

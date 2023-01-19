import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useUser } from "../utils/customHooks";
import { useEffect } from "react";
import { withCookies } from "react-cookie";


export default function Navbar({ token }: { token: string | null }) {
	const router = useRouter();
	const { user, revalid, isLoading } = useUser(token)
	const elements = ["/", "/about"];




	async function onLogout(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			const res = await axios.get("user/logout");
			if (res) {
				delete axios.defaults.headers.common["Authorization"];
				console.log('onLogout', res.headers.cookies);
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
					<button onClick={onLogout}>Logout</button>
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

import { useRouter } from "next/router";
import Link from "next/link";
import AppContext from "../utils/AppContext";
import { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/global";
import { useCookies } from "react-cookie";

export default function Navbar() {
	const router = useRouter();
	const elements = ["/", "/about"];

	const [cookie, setCookie] = useCookies(["user"]);
	const user = cookie.user;

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
			{!user && (
				<Link href="auth">
					<span className="auth">Sign In</span>
				</Link>
			)}
			{user && <span className="auth">{user.email}</span>}
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

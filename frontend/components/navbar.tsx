import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { useUser } from "../utils/customHooks";

export function Navbar() {
	const router = useRouter();
	const { user } = useUser()

	const elements = ["/", "/about"];

	console.log(user);


	async function onLogout(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			await axios.get("user/logout");
			delete axios.defaults.headers.common["Authorization"];
			router.push("/auth")
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
					<div className='avatar' style={{ backgroundImage: `url(${user?.imageURL})` }} />
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
					top:4px;
					right: 16px;
					display:flex;
					justify-content:space-between;
					align-items:center;
				}
				.avatar {
					background-size: cover;
					width:3rem;
					height:3rem;
					border-radius:50%;
					border:1px solid white;
					margin-right:4px;
				}
				button {
					margin-left: 8px;
				}
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

			`}</style>
		</nav>
	);
}

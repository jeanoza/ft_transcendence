import { useRouter } from "next/router";
import Link from "next/link";

export default function Navbar() {
	const router = useRouter();
	const elements = ["/", "/about"];

	return (
		<nav>
			<div className="li">
				{elements.map((el) => {
					return (
						<Link href={el} key={el}>
							<span className={`${router.pathname === el ? "active" : ""}`}>
								{el === "/" ? "Home" : el[1].toUpperCase() + el.slice(2)}
							</span>
						</Link>
					);
				})}
			</div>
			<style jsx>{`
				nav {
					background-color: #424245;
					color: rgba(200, 200, 200, 0.92);
				}
				.li {
					display: flex;
					justify-content: center;
				}
				.li span {
					display: block;
					padding: 16px;
				}
				.li span:hover {
					color: white;
				}
				.active {
					color: white;
				}
			`}</style>
		</nav>
	);
}

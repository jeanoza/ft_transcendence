import Link from "next/link";
import { useRouter } from "next/router";

export function PageList() {
	const router = useRouter();

	return (
		<ul className="d-flex center">
			<li style={{ listStyle: "none" }}>
				<Link href="/">
					<img src="/42_icon.svg" />
				</Link>
			</li>
			<li style={{ listStyle: "none" }}>
				<Link href="/chat">
					<span className={router.pathname.includes("chat") ? "active" : ""}>
						chat
					</span>
				</Link>
			</li>
			{/*<li>
				<Link href="/game">
					<span className={(router.pathname.includes("game")) ? "active" : ""} >
						game
					</span>
				</Link>
			</li>*/}
			<style jsx>{`
				img {
					width: 2rem;
					height: auto;
				}
				ul > li {
					padding: 1.2rem;
				}
				ul > li:first-child {
					padding: 0 1.2rem;
				}
				ul > li:hover {
					color: white;
				}
				span.active {
					color: white;
				}
				span {
					text-transform: capitalize;
				}
			`}</style>
		</ul>
	);
}

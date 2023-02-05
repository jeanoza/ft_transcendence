import Link from "next/link";
import { useRouter } from "next/router";

const elements = {
	home: "/",
	note: "/note",
	chat: "/chat",
	settings: "/settings",
};

export function PageList() {
	const router = useRouter();

	return (
		<ul className="d-flex center">
			{Object.entries(elements).map((el) => {
				const name = el[0];
				const path = el[1];
				return (
					<li key={name}>
						<Link href={path}>
							<span
								className={`${
									router.pathname === path ||
									(router.pathname !== "/" && router.pathname.includes(name))
										? "active"
										: ""
								}`}
							>
								{name}
							</span>
						</Link>
					</li>
				);
			})}
			<style jsx>{`
				ul > li {
					display: block;
					padding: 1.2rem;
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

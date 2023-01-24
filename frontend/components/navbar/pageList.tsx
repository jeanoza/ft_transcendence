import Link from "next/link";
import { useRouter } from "next/router";

const elements = { home: "/", note: "/note" }

export function PageList() {
	const router = useRouter();

	return (
		<ul>
			{Object.entries(elements).map(el => {
				const name = el[0];
				const path = el[1];
				return (
					<li key={name}>
						<Link href={path}>
							<span className={`${router.pathname === path ? "active" : ""}`}>
								{name[0].toUpperCase() + name[0].slice(1)}
							</span>
						</Link>
					</li>)
			}
			)}
		</ul>
	);
}

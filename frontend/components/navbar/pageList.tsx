import Link from "next/link";
import { useRouter } from "next/router";

const elements = { home: "/", note: "/note" };

export function PageList() {
	const router = useRouter();

	return (
		<ul>
			{Object.entries(elements).map((el) => {
				const name = el[0];
				const path = el[1];
				return (
					<li key={name}>
						<Link href={path}>
							<span className={`
								${router.pathname === path
									|| (router.pathname !== "/" && router.pathname.includes(name))
									? "active" : ""}`}>
								{name}
							</span>
						</Link>
					</li>
				);
			})}
			<style jsx>{`
				span {
					text-transform: capitalize;
				}
			`}</style>
		</ul>
	);
}

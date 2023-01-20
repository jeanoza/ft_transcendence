import Link from "next/link";
import { useRouter } from "next/router";

const elements = ["/", "/about"];

export function PageList() {
	const router = useRouter();

	return (
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
	);
}

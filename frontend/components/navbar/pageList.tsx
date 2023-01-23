import Link from "next/link";
import { useRouter } from "next/router";

//FIXME: use object and entry will be better
//ex:
const elements = { home: "/", note: "/note" }
//const elements = ["/", "/note"];

export function PageList() {
	const router = useRouter();

	return (
		//<ul>
		//	{elements.map((el) => {
		//		return (
		//			<li key={el}>
		//				<Link href={el}>
		//					<span className={`${router.pathname === el ? "active" : ""}`}>
		//						{el === "/" ? "Home" : el[1].toUpperCase() + el.slice(2)}
		//					</span>
		//				</Link>
		//			</li>
		//		);
		//	})}
		//</ul>
		<ul>
			{Object.entries(elements).map(el => (
				<li key={el[0]}>
					<Link href={el[1]}>
						<span className={`${router.pathname === el[1] ? "active" : ""}`}>
							{el[0][0].toUpperCase() + el[0].slice(1)}
						</span>
					</Link>
				</li>
			))}
		</ul>
	);
}

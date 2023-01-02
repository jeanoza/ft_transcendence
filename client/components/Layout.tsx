import Navbar from "./Navbar";
import Link from "next/link";
import { useRouter } from "next/router";
export default function Layout({ children }: React.PropsWithChildren) {
	const router = useRouter();
	async function onClick() {
		const res = await fetch("/oauth/autho	rize");
		router.push(res.url);
	}
	return (
		<>
			<Navbar />
			<div>{children}</div>
			<span onClick={onClick}>Login</span>
		</>
	);
}

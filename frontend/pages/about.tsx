import { useEffect } from "react";
import Seo from "../components/Seo";
import Navbar from "../components/navbar";
import { useRouter } from "next/router";

export async function getServerSideProps(context: any) {
	const _cookie = context.req.cookies["user"];
	if (_cookie) return { props: { user: JSON.parse(_cookie) } };
	return { props: {} };
}

export default function About({ user }: any) {
	const router = useRouter();

	useEffect(() => {
		if (!user) router.push("auth");
	}, [user])

	return (
		<>
			<Seo title="About" />
			<Navbar user={user} />
			<main>
				<h1>About</h1>
			</main>
		</>
	);
}

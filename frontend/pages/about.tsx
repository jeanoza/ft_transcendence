import Seo from "../components/seo";
import { useUser } from "../utils/customHooks";
import Navbar from "../components/navbar";
import { Layout } from "../components/layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function getServerSideProps({ req }: any) {
	const token = req.cookies["access_token"] || null
	if (!token)
		return {
			redirect: {
				permanent: false,
				destination: "/auth",
			},
			props: {},
		};
	return { props: { token } }
}
export default function About({ token }: { token: string }) {
	const { user, revalid, isLoading } = useUser(token)
	const router = useRouter();

	return (
		<Layout>
			{/*<Navbar token={token} />*/}
			<Seo title="About" />
			<main>
				<h1 className="">About</h1>
			</main>
		</Layout>
	);
}

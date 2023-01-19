import cookies from "next-cookies";
import Seo from "../components/seo";
import { useUser } from "../utils/customHooks";
import Navbar from "../components/navbar";
import Auth from "../components/auth";
import { Layout } from "../components/layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function getServerSideProps({ req }: any) {
	const token = req.cookies["access_token"] || null
	console.log('index', token);
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
export default function Home({ token }: { token: string }) {
	const { user, revalid, isLoading } = useUser(token)

	return (
		<Layout>
			{/*<Navbar token={token} />*/}
			<Seo title="Home" />
			<main>
				<h1 className="">Home</h1>
			</main>
		</Layout>
	);
}

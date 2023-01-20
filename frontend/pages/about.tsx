import Seo from "../components/seo";
import { useUser } from "../utils/hooks/useUser";
import { Navbar } from "../components/navbar";
import { Layout } from "../components/layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function getServerSideProps({ req }: any) {
	const accessToken = req.cookies["accessToken"] || null;
	if (!accessToken)
		return {
			redirect: {
				permanent: false,
				destination: "/auth",
			},
			props: {},
		};
	//return { props: { accessToken } }
	return { props: {} };
}

//FIXME:Send accessToken to page or not?
export default function About() {
	return (
		<Layout>
			<Navbar />
			<Seo title="About" />
			<main>
				<h1 className="">About</h1>
			</main>
		</Layout>
	);
}

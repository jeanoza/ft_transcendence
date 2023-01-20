import Seo from "../components/seo";
import { useUser } from "../utils/hooks/useUser";
import { Navbar } from "../components/navbar";
import { Layout } from "../components/layout";
import axios from "axios";

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
	axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
	return { props: { accessToken } };
}
//FIXME:Send accessToken to page or not?
export default function Home() {
	const { user } = useUser();
	return (
		<Layout>
			<Navbar />
			<Seo title="Home" />
			<main>
				<h1 className="">Home</h1>
				<div>
					<span>hello, {user?.name}</span>
				</div>
			</main>
		</Layout>
	);
}

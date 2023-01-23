import { Seo } from "../components/seo";
import { Navbar } from "../components/navbar";
import { Layout } from "../components/layout";
import axios from "axios";
import { useUser } from "../utils/hooks/useUser";
import { Loader } from "../components/loader";

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
	return { props: {} };
}

export default function Note() {
	const { user, isLoading } = useUser();
	return (
		<Layout>
			<Navbar />
			<Seo title="Note" />
			{isLoading && <Loader />}
			{user && (
				<main>
					<h1 className="">Note</h1>
				</main>
			)}
		</Layout>
	);
}

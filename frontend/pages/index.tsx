import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { Layout } from "../components/layout";
import { Loader } from "../components/loader";
import { Navbar } from "../components/navbar";

export function getServerSideProps({ req }: any) {
	const accessToken = req.cookies["accessToken"] || null;
	if (!accessToken) {
		return {
			redirect: {
				permanent: false,
				destination: "/auth",
			},
			props: {},
		};
	}
	return { props: {} };
}
export default function Home() {
	const { user, isLoading } = useUser();

	return (
		<Layout>
			<Navbar />
			<Seo title="Home" />
			{isLoading && <Loader />}
			{user && (
				<main>
					<h1 className="">Home</h1>
					<div>
						<span>hello, {user?.name}</span>
					</div>
				</main>
			)}
		</Layout>
	);
}

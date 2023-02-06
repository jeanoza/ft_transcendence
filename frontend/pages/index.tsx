import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { AuthLayout } from "../components/layout";

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
	const { user } = useUser();

	return (
		<AuthLayout>
			<Seo title="Home" />
			<main>
				<h1 className="">Home</h1>
				<div>
					<span>hello, {user?.name}</span>
				</div>
			</main>
		</AuthLayout>
	);
}

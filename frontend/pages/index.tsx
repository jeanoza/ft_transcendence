import cookies from "next-cookies";
import Seo from "../components/seo";
import { useUser } from "../utils/customHooks";
import Navbar from "../components/navbar";
import Auth from "../components/auth";

export function getServerSideProps({ req }: any) {
	const token = req.cookies.accessToken || null
	return { props: { token } }
}
export default function Home({ token }: { token: string }) {
	const { user, revalid, isLoading } = useUser(token)

	return (
		<>
			<Navbar token={token} />
			<Seo title="Home" />
			<main>
				{!user && <Auth />}
				{user &&
					<h1 className="">Home</h1>
				}
			</main>
		</>
	);
}

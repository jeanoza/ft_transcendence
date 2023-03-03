import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { AuthLayout } from "../components/layout";
import { useEffect } from "react";
import axios from "axios";

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

	useEffect(() => {
		async function getAllUserByRank() {
			axios.get("user/rank").then(res => {
				// use this data.
				// put it on state and do it your self what you want
				// data is already ordered by rank
				//ex: res.data[0] is highest ranker
				console.log(res.data);
			})
		}
		getAllUserByRank();
	}, [])

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

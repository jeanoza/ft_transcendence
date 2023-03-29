import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { AuthLayout } from "../components/layout";
import { useEffect } from "react";
import axios from "axios";
import { LiveGameList } from "../components/index/liveGameList";
import LeaderBoard from "../components/index/leaderBoard";

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
	return (
		<AuthLayout>
			<Seo title="Home" />
			<main>
				<div className="d-flex center align-start">
					<LeaderBoard />
					<LiveGameList />
				</div>
			</main>
			<style jsx>{`
				.d-flex {
					margin-top: 4rem;
					gap: 2rem;
				}
				@media screen and (max-width: 512px) {
					.d-flex {
						flex-direction:column;
					}
				}
			`}</style>
			<div></div>
		</AuthLayout>
	);
}

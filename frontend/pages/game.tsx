import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { AuthLayout } from "../components/layout";
import { useSocket } from "../utils/hooks/useSocket";
import { useEffect } from "react";
import Pong from "../components/pong";

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
export default function Game() {
	const { user } = useUser();

	return (
		<AuthLayout>
			<Seo title="Game" />
			<main className="d-flex center">
				<Pong />
			</main>
		</AuthLayout>
	);
}

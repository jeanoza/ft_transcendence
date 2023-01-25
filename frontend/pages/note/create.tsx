import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "../../components/layout";
import { Navbar } from "../../components/navbar";
import { NoteForm } from "../../components/note/noteForm";
import { Seo } from "../../components/seo";
import { useUser } from "../../utils/hooks/swrHelper";
import axios from "axios";

export function getServerSideProps({ req }: any) {
	const accessToken = req.cookies["accessToken"] || null;
	if (!accessToken) {
		delete axios.defaults.headers.common.Authorization;
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

export default function Create() {
	return (
		<Layout>
			<Navbar />
			<Seo title="Note" />
			<main>
				<h1>Create</h1>
				<div className="d-flex justify-end">
					<Link href="/note">
						<span className="cursor-pointer">back</span>
					</Link>
				</div>
				<NoteForm />
			</main>
		</Layout>
	);
}

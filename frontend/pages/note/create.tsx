import Link from "next/link";
import { Layout } from "../../components/layout";
import { Navbar } from "../../components/navbar";
import { NoteForm } from "../../components/note/noteForm";
import { Seo } from "../../components/seo";
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
				<NoteForm />
			</main>
		</Layout>
	);
}

import Link from "next/link";
import { useRouter } from "next/router";
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
		}
	}
	return { props: {} };
}

export default function UpdateNote() {
	const router = useRouter();
	const [id] = router.query.params || [];

	return (
		<Layout>
			<Navbar />
			<Seo title="Update" />
			<main>
				<h1>Update</h1>
				{id && <NoteForm id={id} />}
			</main>
		</Layout>
	);
}

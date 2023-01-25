import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "../../components/layout";
import { Navbar } from "../../components/navbar";
import { NoteForm } from "../../components/note/noteForm";
import { Seo } from "../../components/seo";

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
				<div className="d-flex justify-end">
					<Link href="/note">
						<span className="cursor-pointer">Back</span>
					</Link>
				</div>
				{id && <NoteForm id={id} />}
			</main>
		</Layout>
	);
}

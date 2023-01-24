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
	return {};
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

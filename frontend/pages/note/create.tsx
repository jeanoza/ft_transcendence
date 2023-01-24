import Link from "next/link";
import { useRouter } from "next/router";
import { Layout } from "../../components/layout";
import { Navbar } from "../../components/navbar";
import { NoteForm } from "../../components/note/noteForm";
import { Seo } from "../../components/seo";

export default function Create() {
	const router = useRouter();

	return (
		<Layout>
			<Navbar />
			<Seo title="Note" />
			<main>
				<h1>Create</h1>
				<Link href="/note">
					<span className="cursor-pointer text-right">back</span>
				</Link>
				<NoteForm />
			</main>
		</Layout>
	);
}

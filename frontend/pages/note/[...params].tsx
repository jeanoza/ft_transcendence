import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/layout";
import { Navbar } from "../../components/navbar";
import { Seo } from "../../components/seo";

export default function UpdateNote() {
	const [note, setNote] = useState<INote>();
	const router = useRouter();
	const [id] = router.query.params || [];

	useEffect(() => {
		async function getNote() {
			let res = await axios(`/note/${id}`);
			setNote(res.data);
		}
		if (id) getNote();
		else router.push("/note");
	}, []);

	return (
		<Layout>
			<Navbar />
			<Seo title="Update" />
			<main>
				<h1>Update</h1>
				<Link href="/note">
					<span className="cursor-pointer text-right">Back</span>
				</Link>
				<h3>{note?.title}</h3>
				<span>{note?.content}</span>
			</main>
			<style jsx>{`
				.cursor-pointer {
				}
			`}</style>
		</Layout>
	);
}

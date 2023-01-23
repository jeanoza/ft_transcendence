import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/layout";
import { Navbar } from "../../components/navbar";
import { Seo } from "../../components/seo";

export default function Create() {
	//const [note, setNote] = useState<INote>();
	const router = useRouter();
	console.log(router);
	//const [id] = router.query.params || [];

	//useEffect(() => {
	//	async function getNote() {
	//		let res = await axios(`/note/${id}`);
	//		setNote(res.data);
	//	}
	//	if (id) getNote();
	//}, []);

	return (
		<Layout>
			<Navbar />
			<Seo title="Note" />
			<main>
				<h1>Create</h1>
			</main>
		</Layout>
	);
}

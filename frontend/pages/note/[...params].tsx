import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/layout";
import { Loader } from "../../components/loader";
import { Navbar } from "../../components/navbar";
import { NoteForm } from "../../components/note/noteForm";
import { Seo } from "../../components/seo";

export default function UpdateNote() {
	const router = useRouter();
	const [id] = router.query.params || [];

	return (
		<Layout>
			<Navbar />
			<Seo title="Update" />
			<main>
				<h1>Update</h1>
				<Link href="/note">
					<span className="cursor-pointer text-right">Back</span>
				</Link>
				{id && <NoteForm id={id} />}
			</main>
		</Layout>
	);
}

import { Seo } from "../components/seo";
import { Navbar } from "../components/navbar";
import { Layout } from "../components/layout";
import axios from "axios";
import { useUser } from "../utils/hooks/useUser";
import { Loader } from "../components/loader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { NoteTable } from "../components/note/noteTable";

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
	axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
	return { props: {} };
}

export default function Note() {
	const { user, isLoading } = useUser();
	const [notes, setNotes] = useState<INote | null>(null);

	useEffect(() => {
		async function getNotes() {
			try {
				const res = await axios.get("note");
				setNotes(res.data);
			} catch (e) {
				console.log(e);
			}
		}
		getNotes();
	}, []);
	return (
		<Layout>
			<Navbar />
			<Seo title="Note" />
			{(isLoading || !notes) && <Loader />}
			{user && (
				<main>
					<h1 className="">Note</h1>
					<div className="d-flex justify-end">
						<Link href="/note/create">
							<span className="cursor-pointer">Create</span>
						</Link>
					</div>
					<NoteTable notes={notes} />
				</main>
			)}
		</Layout>
	);
}

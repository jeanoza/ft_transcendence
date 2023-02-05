import { Seo } from "../components/seo";
import { Layout } from "../components/layout";
import { useAllNote, useUser } from "../utils/hooks/swrHelper";
import { Loader } from "../components/loader";
import React from "react";
import { NoteTable } from "../components/note/noteTable";
import { useRouter } from "next/router";
import { Navbar } from "../components/navbar";

export function getServerSideProps({ req }: any) {
	const accessToken = req.cookies["accessToken"] || null;
	if (!accessToken) {
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

export default function Note() {
	const { user, isLoading } = useUser();
	const { notes, isLoading: noteIsLoading } = useAllNote();
	const router = useRouter();

	function onClick(e: React.MouseEvent) {
		e.preventDefault();
		router.push("/note/create");
	}

	return (
		<Layout>
			<Navbar />
			<Seo title="Note" />
			{(isLoading || noteIsLoading) && <Loader />}
			{user && (
				<main>
					<h1 className="">Note</h1>
					<div className="d-flex justify-end">
						<button onClick={onClick}>Add</button>
					</div>
					<NoteTable notes={notes} />
				</main>
			)}
		</Layout>
	);
}

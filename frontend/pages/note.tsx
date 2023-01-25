import { Seo } from "../components/seo";
import { Navbar } from "../components/navbar";
import { Layout } from "../components/layout";
import axios from "axios";
import { useAllNote, useUser } from "../utils/hooks/swrHelper";
import { Loader } from "../components/loader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { NoteTable } from "../components/note/noteTable";

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

export default function Note() {
	const { user, isLoading } = useUser();
	const { notes, isLoading: noteIsLoading } = useAllNote();

	return (
		<Layout>
			<Navbar />
			<Seo title="Note" />
			{(isLoading || noteIsLoading) && <Loader />}
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

import { Seo } from "../components/seo";
import { Navbar } from "../components/navbar";
import { Layout } from "../components/layout";
import axios from "axios";
import { useUser } from "../utils/hooks/useUser";
import { Loader } from "../components/loader";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

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
	const [notes, setNotes] = useState<any>(null);
	const router = useRouter();

	function onClick(id: number) {
		router.push("note/" + id);
	}

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
			{isLoading && <Loader />}
			{user && (
				<main>
					<h1 className="">Note</h1>
					<table>
						<thead>
							<tr>
								<th>Title</th>
								<th>Content</th>
								<th>Created at</th>
								<th>Updated at</th>
							</tr>
						</thead>
						<tbody>
							{notes &&
								notes?.map((el: any) => (
									<tr key={el.id} onClick={() => onClick(el.id)}>
										<th>{el.title}</th>
										<td>{el.content}</td>
										<td>{el.createdAt}</td>
										<td>{el.updatedAt}</td>
									</tr>
								))}
						</tbody>
					</table>
				</main>
			)}
			<style jsx>{`
				table {
					margin-top: 32px;
					width: 100%;
				}
				tr {
					cursor: pointer;
				}
			`}</style>
		</Layout>
	);
}

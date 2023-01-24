import router from "next/router";

function onClick(id: number) {
	router.push("note/" + id);
}

export function NoteTable({ notes }: { notes: INote[] | any }) {
	return (
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
					notes.map((el: INote) => (
						<tr key={el.id} onClick={() => onClick(el.id)}>
							<td>{el.title}</td>
							<td>{el.content}</td>
							<td>{el.createdAt}</td>
							<td>{el.updatedAt}</td>
						</tr>
					))}
			</tbody>
			<style jsx>{`
				table {
					margin-top: 16px;
					width: 100%;
					border-collapse: collapse;
				}
				tr {
					cursor: pointer;
				}
				th,
				td {
					border: 1px solid white;
					height: 24px;
				}
				th {
					background-color: #bdc3c7;
					color: white;
				}
			`}</style>
		</table>
	);
}

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
					<th>Author</th>
					<th>Created at</th>
					<th>Updated at</th>
				</tr>
			</thead>
			<tbody>
				{notes &&
					notes.map((el: INote) => {
						return (
							<tr key={el.id} onClick={() => onClick(el.id!)}>
								<td>{el.title}</td>
								<td>{el.content}</td>
								<td>{el.author?.name}</td>
								<td>{new Date(el.createdAt).toLocaleString()}</td>
								<td>{new Date(el.updatedAt).toLocaleString()}</td>
							</tr>
						)
					})}
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
					max-width: 100px;
					padding: 8px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				th {
					background-color: rgb(240,240,240);
				}
			`}</style>
		</table>
	);
}

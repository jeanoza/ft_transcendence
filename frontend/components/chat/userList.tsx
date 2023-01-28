export function UserList({ userList }: { userList: string[] }) {
	return <ul>
		{userList.map((el, index) => <li key={index}>{el}</li>)}
		<style jsx>{`
			ul {
				display:flex;
				flex-direction:column;
				padding: 1rem;
				border-left:1px solid rgb(200,200,200);
			}
			li {
				min-width:80px;
				width:100%;
			}
		`}</style>
	</ul>
}
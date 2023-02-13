import { useEffect, useState } from "react";
import { useSocket } from "../../utils/hooks/useSocket";
import { Avatar } from "../avatar";

export function UserList({ channel }: { channel: string | null }) {
	const { socket } = useSocket("chat");
	const [userList, setUserList] = useState<string[] | null>(null);

	useEffect(() => {
		socket.on("userList", function (data) {
			setUserList(data);
		});
		return () => {
			//clean up socket event
			socket.off("userList");
		};
	}, [channel]);

	if (!userList) return null;
	return (
		<ul>
			{userList.map((el: any, index) => (
				<li key={index} className="d-flex center justify-start">
					<Avatar url={el.imageURL} status={el.status} size="sm"></Avatar>
					<span>{el.name}</span>
				</li>
			))}
			<style jsx>{`
				ul {
					display: flex;
					flex-direction: column;
					padding: 0.5rem;
					border-left: 1px solid var(--border-color);
				}
				li {
					/*width: 100%;*/
					gap: 0.5rem;
				}
			`}</style>
		</ul>
	);
}

import { useEffect, useState } from "react";
import { useSocket } from "../../utils/hooks/useSocket";
import { Avatar } from "../avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function UserList({ channel, openUserModal }: { channel: string | null, openUserModal: any }) {
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
				<li key={index} className="d-flex center justify-start p-2 cursor">
					<Avatar url={el.imageURL} status={el.status} size="sm"></Avatar>
					<span className="text-overflow">{el.name}</span>
					<div
						className="icon-cont py-3 px-1"
						onClick={() => openUserModal(el.id)}
					>
						<FontAwesomeIcon icon="circle-info" />
					</div>
				</li>
			))}
			<style jsx>{`
				ul {
					display: flex;
					flex-direction: column;
					padding: 0.5rem;
					border-left: 1px solid var(--border-color);
					width: 160px;
					min-width: 160px;
				}
				li {
					gap: 0.5rem;
					border-radius: 8px;
				}
				li:hover {
					background-color: var(--gray-light-1);
				}
			`}</style>
		</ul>
	);
}

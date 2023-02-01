import { useEffect, useState } from "react";
import { useSocket } from "../../utils/hooks/useSocket"

export function UserList(channelId) {
	const { socket } = useSocket('chat')
	const [userList, setUserList] = useState<string[] | null>(null)

	useEffect(() => {
		socket.on('userList', function (data) {
			setUserList(data);
		})
		return () => {
			//clean up socket event
			socket.off('userList')
		}
	}, []);

	if (!userList) return null
	return (
		<ul>
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
	)
}
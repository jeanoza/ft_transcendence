import React, { ButtonHTMLAttributes, Dispatch, SetStateAction } from "react";
import { useUser } from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";


const channelList = ['chat1', 'chat2', 'chat3']; // for test

export function ChannelList({ channel, setReceived, setChannel, }: {
	channel: string | null,
	setReceived: Dispatch<SetStateAction<{ sender: string; message: string; }[]>>,
	setChannel: Dispatch<SetStateAction<string | null>>
}) {
	const { user } = useUser();
	const { socket } = useSocket('chat');

	function onChangeChannel(e: React.MouseEvent<HTMLButtonElement>) {
		const toJoin = e.currentTarget.innerText;
		if (toJoin !== channel) {
			document.querySelector('button.active')?.classList.remove('active')
			e.currentTarget.classList.add('active')
			setReceived([]);
			setChannel(toJoin);
			socket.emit('leaveChannel', { channel, user: user.name })
			socket.emit('joinChannel', { channel: toJoin, user: user.name })
		}
	}

	return <ul>
		{channelList.map((el, index) => <li key={index}><button onClick={onChangeChannel}>{el}</button></li>)}
		<style jsx>{`
			ul {
				display:flex;
				flex-direction:column;
				padding: 1rem;
				border-right: 1px solid rgb(200,200,200);
			}
			li {
				min-width:80px;
				width:100%;
			}
			button.active {
				/* FIXME: to modify after*/
				border-bottom:1px solid black;
				border-right:1px solid black;
				color: #06c;
				/*font-weight:600;*/
			}
		`}</style>
	</ul>
}
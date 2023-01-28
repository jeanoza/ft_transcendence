import { useSocket } from "../../utils/hooks/useSocket";


export function ChannelList({ channelList, onChangeChannel }: { channelList: string[], onChangeChannel: any }) {
	const { socket } = useSocket('chat');
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
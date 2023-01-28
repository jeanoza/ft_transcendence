import { useEffect, useRef, useState } from "react";
import { Layout } from "../components/layout";
import { Loader } from "../components/loader";
import { Navbar } from "../components/navbar";
import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { InputField } from "../components/inputField";
import axios from "axios";
import { io } from "socket.io-client";
import { Socket } from "socket.io";
import { ChannelList } from "../components/chat/channelList";
import { UserList } from "../components/chat/userList";
import { useSocket } from "../utils/hooks/useSocket";

//let socket: Socket | any;
const chanList = ['chat1', 'chat2', 'chat3']; // for test

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
		};
	}

	return { props: {} };
}
export default function Chat() {
	const { user, isLoading } = useUser();
	const [message, setMessage] = useState<string>("");
	const [received, setReceived] = useState<any[]>([]);
	const [channel, setChannel] = useState<string | null>(null); //current channel
	const [userList, setUserList] = useState<string[] | null>(null)
	const { socket } = useSocket('chat')
	const dialogueRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (user) {
			socket.on('userList', function (data) {
				setUserList(data);
			})
			socket.on("recvMSG", function (data) {
				setReceived((prev) => [...prev, data]);
			});
		}
	}, [user]);

	async function onKeydown(e) {
		if (e.keyCode === 13) {
			const dialogueCont: HTMLDivElement = dialogueRef.current as HTMLDivElement;
			socket?.emit("sendMSG", {
				sender: user.name,
				message,
				channel,
			});
			dialogueCont.scrollTo(0, dialogueCont.scrollHeight) // scroll to last message
			setMessage("");
		}
	}

	function onChangeChannel(e) {
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

	return (
		<Layout>
			<Navbar />
			<Seo title="Chat" />
			{isLoading && <Loader />}
			{user && (
				<main>
					<div className="chat d-flex justify-between">
						<ChannelList channelList={chanList} onChangeChannel={onChangeChannel} />
						<div className="chat-display d-flex column justify-between">
							<div className="chat-display-dialogue" ref={dialogueRef}>
								{!received.length ? <div /> :
									received.map((el, index) => (
										<div key={index}>
											<span className="sender">{el.sender}:</span>
											<span>{el.message}</span>
										</div>
									))}
							</div>
							<InputField
								type="text"
								name="message"
								state={message}
								setState={setMessage}
								onKeydown={onKeydown}
							/>
						</div>
						{userList && <UserList userList={userList} />}
					</div>
				</main>
			)}
			<style jsx>{`
				main {
					/*width:80%;*/
				}
				ul {
					display:flex;
					flex-direction:column;
				}
				ul > li {
				}
				.sender {
					font-weight: 600;
					margin-right: 1rem;
				}
				.chat {
					height: 100%;
					background-color: rgb(240, 240, 240);
					border-radius: 8px;
				}
				.chat-display {
					width: 100%;
					padding: 0rem 1rem;
				}
				.chat-display-dialogue {
					padding: 1rem 0;
					overflow-y: auto;
				}

			`}</style>
		</Layout>
	);
}

import { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { Loader } from "../components/loader";
import { Navbar } from "../components/navbar";
import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { InputField } from "../components/inputField";
import axios from "axios";
import { io } from "socket.io-client";
import { Socket } from "socket.io";

let socket: Socket | any;

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
	const [userList, setUserList] = useState<string[]>([])

	useEffect(() => {
		async function socketConnector() {
			socket = io("http://localhost:8888/ws-chat");
			socket.on("connect", function () {
				console.log("Chat Connected", socket.id);
				socket.emit("joinRoom", { user: user.name, room: "default" }); // FIXME: to replace after
			});
			socket.on('userList', function (data) {
				console.log(data);
				setUserList(data);
			})
			socket.on("disconnect", function () {
				console.log("Disconnected", socket.id);
			});
			socket.on("recvMSG", function (data) {
				setReceived((prev) => [...prev, data]);
			});
		}
		if (user) socketConnector();
		console.log('here');
	}, [user]);

	async function onKeydown(e) {
		if (e.keyCode === 13) {
			socket?.emit("sendMSG", {
				sender: user.name,
				message,
				room: "default",
			});
			setMessage("");
		}
	}
	async function onDisconnect(e) {
		socket?.emit("leaveRoom", { user: user.name, room: "default" }, (data) => {
			console.log(data);
		}); // FIXME: to replace after
	}

	return (
		<Layout>
			<Navbar />
			<Seo title="Chat" />
			{isLoading && <Loader />}
			{user && (
				<main>
					<div className="chat d-flex justify-between">
						<div className="chat-channels">
							<div>bla</div>
							<div>bla</div>
							<div>bla</div>
							<button onClick={onDisconnect}>Disconnect</button>
						</div>
						<div className="chat-display d-flex column justify-between">
							<div className="chat-display-dialogue">
								{received.length &&
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
						<div className="chat-users">
							<ul>
								{userList?.map((el, index) => <li key={index}>{el}</li>)}
							</ul>
						</div>
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
				.chat > div {
				}
				.chat-display {
					width: 100%;
					border: 1px rgb(200, 200, 200);
					border-style: none solid none solid;
					padding: 0rem 1rem;
				}
				.chat-channels,
				.chat-users {
					width: 20rem;
					padding: 1rem;
					/*background-color:rgb(200,200,200)*/
				}
				.chat-display-dialogue {
					padding: 1rem 0;
					overflow-y: auto;
				}
			`}</style>
		</Layout>
	);
}

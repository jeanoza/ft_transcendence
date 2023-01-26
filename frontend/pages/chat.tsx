import { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { Loader } from "../components/loader";
import { Navbar } from "../components/navbar";
import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { InputField } from "../components/inputField";
import axios from "axios";
import { Socket } from "socket.io";
import { io } from "socket.io-client";

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

	useEffect(() => {
		async function socketConnector() {
			socket = io("http://localhost:8888/ws-chat");
			socket.on("connect", function () {
				console.log("Chat Connected");

				socket.emit("events", { id: user?.id });
				socket.emit("identity", { user }, (response) =>
					console.log("Identity:", response)
				);
			});
			socket.on("events", function (data) {
				console.log("event", data);
			});
			socket.on("exception", function (data) {
				console.log("event", data);
			});
			socket.on("disconnect", function () {
				console.log("Disconnected");
			});
			socket.on("message", function (data) {
				console.log("message-client", data);
			});
		}
		socketConnector();
	}, []);

	async function onKeydown(e) {
		if (e.keyCode === 13) socket.emit("message", message);
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
						</div>
						<div className="chat-display d-flex column justify-between">
							<div className="chat-display-dialogue">bla</div>
							<InputField
								type="text"
								name="message"
								state={message}
								setState={setMessage}
								onKeydown={onKeydown}
							/>
						</div>
						<div className="chat-users"></div>
					</div>
				</main>
			)}
			<style jsx>{`
				main {
					/*width:80%;*/
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
				}
			`}</style>
		</Layout>
	);
}

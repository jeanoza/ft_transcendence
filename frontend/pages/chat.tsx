import { useEffect, useRef, useState } from "react";
import { Layout } from "../components/layout";
import { Loader } from "../components/loader";
import { Navbar } from "../components/navbar";
import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import axios from "axios";
import { ChannelList } from "../components/chat/channelList";
import { UserList } from "../components/chat/userList";
import { useSocket } from "../utils/hooks/useSocket";
import { ChatDisplay } from "../components/chat/chatDisplay";
import { Modal } from "../components/modal";

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
	const { socket } = useSocket("chat");
	const [received, setReceived] = useState<{ sender: string; message: string }[]>([]);
	const [channel, setChannel] = useState<string | null>(null); //current channel
	const [modal, setModal] = useState<boolean>(false)

	useEffect(() => {
		//socket.on("chat", function (data) {
		//	console.log(data);
		//});
		if (user) {
			console.log(user, 'in chat tsx')
			socket.emit('chat', user.id)
		}
		socket.on("recvMSG", function (data) {
			setReceived((prev) => [...prev, data]);
		});
		return () => {
			//clean up socket event
			socket.off("recvMSG");
		};
	}, []);

	return (
		<Layout>
			<Navbar />
			<Seo title="Chat" />
			{isLoading && <Loader />}
			{user && (
				<main>
					<div className="chat d-flex justify-between">
						<ChannelList
							channel={channel}
							setReceived={setReceived}
							setChannel={setChannel}
							setModal={setModal}
						/>
						<ChatDisplay received={received} channel={channel} />
						<UserList />
					</div>
				</main>
			)}
			<Modal modal={modal} setModal={setModal} />
			<style jsx>{`
				main {
					width:96%;
				}
				.chat {
					height: 100%;
					background-color: rgb(240, 240, 240);
					border-radius: 8px;
				}
			`}</style>
		</Layout>
	);
}

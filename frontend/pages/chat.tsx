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
	const [channel, setChannel] = useState<string | null>(null); //current channel
	const [channels, setChannels] = useState<any>([]);
	const [modal, setModal] = useState<boolean>(false)

	useEffect(() => {
		socket.on("channels", async (data) => {
			setChannels(data);
		});
		return () => {
			socket.off("channels");
		};
	}, []);

	function onChangeChannel(e) {
		const target = e.currentTarget
		//FIXME: this is a js method but another way with react?
		document.querySelector('li.active')?.classList.remove('active')
		target.classList.add('active')
		setChannel(target.title)
	}

	return (
		<Layout>
			<Navbar />
			<Seo title="Chat" />
			{isLoading && <Loader />}
			{user && (
				<main>
					<div className="chat d-flex justify-between">
						<ChannelList
							channels={channels}
							setModal={setModal}
							onChangeChannel={onChangeChannel}
						/>
						<ChatDisplay channel={channel} />
						<UserList channel={channel} />
					</div>
				</main>
			)}
			<Modal modal={modal} setModal={setModal} />
			<style jsx>{`
				main {
					/*width:96%;*/
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

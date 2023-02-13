import { useEffect, useState } from "react";
import { AuthLayout } from "../components/layout";
import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { ChannelList } from "../components/chat/channelList";
import { UserList } from "../components/chat/userList";
import { useSocket } from "../utils/hooks/useSocket";
import { ChatDisplay } from "../components/chat/chatDisplay";
import { ChatModal } from "../components/modals/chatModal";

export function getServerSideProps({ req }: any) {
	const accessToken = req.cookies["accessToken"] || null;
	if (!accessToken) {
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

//let socketUpdated = false; // to socket_id send only one time.

export default function Chat() {
	const { user } = useUser();
	const { socket } = useSocket("chat");
	const [channel, setChannel] = useState<string | null>(null); //current channel
	const [channels, setChannels] = useState<any>([]);
	const [modal, setModal] = useState<boolean>(false);

	useEffect(() => {
		socket.on("channels", async (data) => {
			setChannels(data);
		});
		return () => {
			socket.off("channels");
		};
	}, [user]);

	function onChangeChannel(e: React.MouseEvent<HTMLElement>) {
		const target = e.currentTarget;
		//FIXME: this is a js method but another way with react?
		document.querySelector("li.active")?.classList.remove("active");
		target?.classList?.add("active");
		setChannel(target?.title);
	}

	return (
		<AuthLayout>
			<Seo title="Chat" />
			<main>
				<div className="chat d-flex justify-between">
					<ChannelList
						channels={channels}
						openModal={() => setModal(true)}
						onChangeChannel={onChangeChannel}
					/>
					<ChatDisplay channel={channel} />
					<UserList channel={channel} />
				</div>
			</main>
			{modal && <ChatModal onClose={() => setModal(false)} />}
			<style jsx>{`
				.chat {
					height: 100%;
					background-color: var(--gray-light-0);
					border-radius: 8px;
				}
			`}</style>
		</AuthLayout>
	);
}

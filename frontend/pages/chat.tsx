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
	const [dm, setDm] = useState<string | null>(null);
	const [channels, setChannels] = useState<any>([]);
	const [dms, setDms] = useState<any>([]);
	const [modal, setModal] = useState<boolean>(false);

	useEffect(() => {
		socket.on("channels", async (channels) => {
			setChannels(channels);
		});
		socket.on("dms", async (dms) => {
			setDms(dms);
		})
		return () => {
			socket.off("channels");
			socket.off("dms")
		};
	}, [user]);


	return (
		<AuthLayout>
			<Seo title="Chat" />
			<main>
				<div className="chat d-flex justify-between">
					<ChannelList
						channels={channels}
						dms={dms}
						openModal={() => setModal(true)}
						channel={channel}
						setChannel={setChannel}
						setDm={setDm}
					/>
					<ChatDisplay channel={channel} dm={dm} />
					{channel && (<UserList channel={channel} />)}
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

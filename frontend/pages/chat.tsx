import { useState } from "react";
import { AuthLayout } from "../components/layout";
import { Seo } from "../components/seo";
import { ChannelList } from "../components/chat/channelList";
import { UserList } from "../components/chat/userList";
import { ChatDisplay } from "../components/chat/chatDisplay";
import { ChatModal } from "../components/modals/chatModal";
import { UserModal } from "../components/modals/userModal";

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

export default function Chat() {
	const [channelName, setChannelName] = useState<string | null>(null); //current channelName
	const [dmName, setDmName] = useState<string | null>(null);
	const [openChatModal, setChatModal] = useState<boolean>(false);
	const [openUserModal, setUserModal] = useState<boolean>(false);
	const [userId, setUserId] = useState<number | null>(null);

	async function handleOpenUserModal(id: number) {
		setUserId(id);
		setUserModal(true);
	}

	return (
		<AuthLayout>
			<Seo title="Chat" />
			<main>
				<div className="chat d-flex justify-between">
					<ChannelList
						openUserModal={handleOpenUserModal}
						openChatModal={() => setChatModal(true)}
						channelName={channelName}
						setChannelName={setChannelName}
						setDmName={setDmName}
					/>
					<ChatDisplay channelName={channelName} dmName={dmName} />
					{channelName && <UserList channelName={channelName} openUserModal={handleOpenUserModal} />}
				</div>
			</main>
			{openChatModal && <ChatModal onClose={() => setChatModal(false)} />}
			{openUserModal && userId && (
				<UserModal userId={userId} onClose={() => setUserModal(false)} />
			)}
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

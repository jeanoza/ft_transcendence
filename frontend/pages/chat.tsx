import { useEffect, useState } from "react";
import { AuthLayout } from "../components/layout";
import { Seo } from "../components/seo";
import { ChannelList } from "../components/chat/channelList";
import { UserList } from "../components/chat/userList";
import { ChatDisplay } from "../components/chat/chatDisplay";
import { NewChatModal } from "../components/modals/newChatModal";
import { UserModal } from "../components/modals/userModal";
import { UpdateChatModal } from "../components/modals/updateChatModal";

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
	const [openNewChatModal, setNewChatModal] = useState<boolean>(false);
	const [openUserModal, setUserModal] = useState<boolean>(false);
	const [openUpdateChatModal, setUpdateChatModal] = useState<boolean>(false);
	const [userId, setUserId] = useState<number | null>(null);
	const [channelId, setChannelId] = useState<number | null>(null);


	async function handleOpenUserModal(id: number) {
		setUserId(id);
		setUserModal(true);
	}

	async function handleOpenUpdateChatModal(channelId: number) {
		setChannelId(channelId);
		setUpdateChatModal(true);
	}

	return (
		<AuthLayout>
			<Seo title="Chat" />
			<main>
				<div className="chat d-flex justify-between">
					<ChannelList
						openUserModal={handleOpenUserModal}
						openNewChatModal={() => setNewChatModal(true)}
						openUpdateChatModal={handleOpenUpdateChatModal}
						channelName={channelName}
						setChannelName={setChannelName}
						setDmName={setDmName}
					/>
					<ChatDisplay
						channelName={channelName}
						dmName={dmName}
						setChannelName={setChannelName}
					/>
					{channelName && (
						<UserList
							channelName={channelName}
							openUserModal={handleOpenUserModal}
						/>
					)}
				</div>
			</main>
			{openUpdateChatModal && channelId && (
				<UpdateChatModal
					channelId={channelId}
					onClose={() => setUpdateChatModal(false)}
				/>
			)}
			{openNewChatModal && (
				<NewChatModal onClose={() => setNewChatModal(false)} />
			)}
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

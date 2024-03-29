import { Router, useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
	useAllBlocked,
	useAllDM,
	useBlocked,
	useIsBanned,
	useIsMuted,
	useUser,
} from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";
import { Avatar } from "../avatar";
import { InputField } from "../inputField";
import axios from "axios";
import { Loader } from "../loader";
import DOMPurify from "dompurify";

interface IChat {
	sender: IUser;
	content: string;
}

export function ChatDisplay({
	channelName,
	setChannelName,
	dmName,
}: {
	channelName: string | null;
	setChannelName: any;
	dmName: string | null;
}) {
	const { socket } = useSocket("chat");
	const { user } = useUser();
	const [content, setContent] = useState<string>("");
	const [chats, setChats] = useState<IChat[]>([]);
	const { revalid } = useAllDM();
	const dialogueRef = useRef<HTMLDivElement>(null);
	const { isBanned } = useIsBanned(channelName!);
	const { isMuted, revalid: revalidMuted } = useIsMuted(channelName!);

	useEffect(() => {
		socket.on("getAllChannelChat", async function (channelChats) {
			setChats(await filterChatByBlocked(channelChats));
			await ajustScroll();
		});
		socket.on("getAllDM", async function (dmChats) {
			setChats(dmChats); //for DM, it's server who do blocked filter
			await ajustScroll();
		});
		socket.on("muted", async function (mutedChannel: string, mutedTime) {
			window.alert(`Your are muted in ${mutedChannel}`);
			setTimeout(() => {
				revalidMuted();
			}, mutedTime);
		});
		socket.on("banned", function (bannedChannel: string) {
			window.alert(`Your are banned in ${bannedChannel}`);
			socket.emit("leaveChannel", { channelName: bannedChannel });
			setChannelName(null);
			setChats([]);
		});
		socket.on("kicked", function (kickedChannel: string) {
			window.alert(`Your are kicked in ${kickedChannel} `);
			socket.emit("leaveChannel", { channelName: kickedChannel });
			setChannelName(null);
			setChats([]);
		});
		return () => {
			socket.off("getAllChannelChat");
			socket.off("getAllDM");
			socket.off("banned");
			socket.off("kicked");
			socket.off("muted");
		};
	}, []);

	useEffect(() => {
		if (channelName) socket.emit("joinChannel", { channelName, user });
		else if (dmName) socket.emit("joinDM", { user, otherName: dmName });

		socket.on("recvMSG", async function (data) {
			revalid();
			if (data.chatName === channelName || data.chatName === dmName) {
				const filtered = await filterChatByBlocked([data]);
				setChats((prev) => [...prev, ...filtered]);
				await ajustScroll();
			}
		});

		return () => {
			socket.off("recvMSG");
		};
	}, [channelName, dmName]);

	async function filterChatByBlocked(channelChats: IChat[]) {
		const blockeds = await (await axios.get("blocked/")).data;
		return channelChats.filter(
			(chat) =>
				!blockeds.find((blocked: IUser) => blocked.id === chat.sender.id)
		);
	}

	async function ajustScroll() {
		const dialogueCont: HTMLDivElement = dialogueRef.current as HTMLDivElement;
		setTimeout(() => {
			dialogueCont?.scrollTo(0, dialogueCont?.scrollHeight); // scroll to last message
		});
	}

	function onKeyUp(e: KeyboardEvent) {
		if (content.length && (channelName || dmName) && e.code === "Enter") {
			const _content = DOMPurify.sanitize(content);
			if (channelName)
				socket?.emit("channelChat", {
					user: {
						id: user.id,
						name: user.name,
						status: user.status,
						imageURL: user.imageURL,
					},
					content: _content,
					channelName,
				});
			else if (dmName) {
				socket?.emit("dm", {
					sender: user,
					receiverName: dmName,
					content: _content,
				});
			}
			setContent("");
		}
	}
	if ((!channelName && !dmName) || isBanned) return null;
	return (
		<div className="chat-display d-flex column justify-between">
			<h3>
				{channelName ? channelName : dmName ? dmName : "Please join chat:)"}
			</h3>
			<div className="chat-display-dialogue" ref={dialogueRef}>
				{!chats.length ? (
					<div />
				) : (
					chats.map((el, index) => {
						const isMine = el.sender.id === user.id;
						return (
							<div
								key={index}
								className={`d-flex my-4 ${isMine ? "justify-end" : ""}`}
							>
								{!isMine && <Avatar url={el.sender.imageURL} size="sm" />}
								<div className="mx-2">
									{!isMine && <span className="sender">{el.sender.name}</span>}
									<div className="d-flex">
										<div className={`content ${isMine ? "mine" : ""}`}>
											{el.content}
										</div>
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>
			{(channelName || dmName) && (
				<div className="message">
					{isMuted ? (
						<div className="field">
							<label>message</label>
							<input type="text" placeholder="You are muted" readOnly />
						</div>
					) : (
						<InputField
							type="text"
							name="message"
							state={content}
							setState={setContent}
							onKeyUp={onKeyUp}
						/>
					)}
				</div>
			)}
			<style jsx>{`
				h3 {
					padding: 1rem;
					border-bottom: 1px solid var(--border-color);
					background-color: white;
				}
				.sender {
					font-weight: 600;
					display: block;
					margin-right: 1rem;
					margin-bottom: 0.5rem;
				}
				.content {
					background-color: var(--gray-light-1);
					line-break: anywhere;
					padding: 0.5rem;
					border-radius: 8px;
					min-height: 2rem;
				}
				.content.mine {
					background-color: var(--bg-accent);
					color: white;
				}
				.chat-display {
					width: 100%;
				}
				.message {
					padding: 0 1rem;
					background-color: white;
				}
				.chat-display-dialogue {
					height: 100%;
					overflow-y: auto;
					padding: 1rem;
					background-color: white;
				}
			`}</style>
		</div>
	);
}

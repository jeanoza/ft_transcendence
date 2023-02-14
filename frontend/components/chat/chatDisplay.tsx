import { useEffect, useRef, useState } from "react";
import _2fa from "../../pages/_2fa";
import { useUser } from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";
import { Avatar } from "../avatar";
import { InputField } from "../inputField";

export function ChatDisplay({ channel }: { channel: string | null }) {
	const { socket } = useSocket("chat");
	const { user } = useUser();
	const [content, setContent] = useState<string>("");
	const [received, setReceived] = useState<{ sender: IUser; content: string }[]>(
		[]
	);
	const dialogueRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		socket.on("getChannelChats", async function (data) {
			setReceived(data);
			await ajustScroll();
		});
		return () => {
			socket.off("getChanelChats");
		};
	}, []);

	useEffect(() => {
		if (channel) socket.emit("joinChannel", { channelName: channel, user });

		socket.on("recvMSG", async function (data) {
			setReceived((prev) => [...prev, data]);
			await ajustScroll();
		});

		return () => {
			socket.off("recvMSG");
		};
	}, [channel]);

	async function ajustScroll() {
		const dialogueCont: HTMLDivElement = dialogueRef.current as HTMLDivElement;
		setTimeout(() => {
			dialogueCont?.scrollTo(0, dialogueCont?.scrollHeight); // scroll to last message
		});
	}

	async function onKeydown(e: KeyboardEvent) {
		if (channel && e.code === "Enter") {
			socket?.emit("sendMSG", {
				user: {
					id: user.id,
					name: user.name,
					status: user.status,
					imageURL: user.imageURL,
				},
				content,
				channel,
			});
			setContent("");
		}
	}
	return (
		<div className="chat-display d-flex column justify-between">
			<h3>{channel ? channel : "Please join channel:)"}</h3>
			<div className="chat-display-dialogue" ref={dialogueRef}>
				{!received.length ? (
					<div />
				) : (
					received.map((el, index) => {
						const isMine = el.sender.id === user.id;
						return (
							<div
								key={index}
								className={`d-flex my-4 ${isMine ? "justify-end" : ""}`}
							>
								{!isMine && (
									<Avatar
										url={el.sender.imageURL}
										status={el.sender.status}
										size="sm"
									/>
								)}
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
			{channel && (
				<div className="message">
					<InputField
						type="text"
						name="message"
						state={content}
						setState={setContent}
						onKeydown={onKeydown}
					/>
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

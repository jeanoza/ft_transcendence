import { useEffect, useRef, useState } from "react";
import { useAllDmByUserId, useUser } from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";
import { Avatar } from "../avatar";
import { InputField } from "../inputField";

export function ChatDisplay({ channel, dm }: { channel: string | null; dm: string | null }) {
	const { socket } = useSocket("chat");
	const { user } = useUser();
	const [content, setContent] = useState<string>("");
	const [received, setReceived] = useState<{ sender: IUser; content: string }[]>(
		[]
	);
	const { revalid } = useAllDmByUserId(user.id);
	const dialogueRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		socket.on("getAllChannelChat", async function (data) {
			setReceived(data);
			await ajustScroll();
		});
		socket.on("getAllDM", async function (data) {
			setReceived(data);
			await ajustScroll();
		})
		return () => {
			socket.off("getAllChannelChat");
			socket.off("getAllDM");
		};
	}, []);


	useEffect(() => {
		if (channel) socket.emit("joinChannel", { channelName: channel, user });
		else if (dm) socket.emit("joinDM", { user, otherName: dm })

		socket.on("recvMSG", async function (data) {
			revalid();
			if (data.chatName === channel || data.chatName === dm) {
				setReceived((prev) => [...prev, data]);
				await ajustScroll();
			}
		});

		return () => {
			socket.off("recvMSG");
		};
	}, [channel, dm]);

	async function ajustScroll() {
		const dialogueCont: HTMLDivElement = dialogueRef.current as HTMLDivElement;
		setTimeout(() => {
			dialogueCont?.scrollTo(0, dialogueCont?.scrollHeight); // scroll to last message
		});
	}

	function onKeyUp(e: KeyboardEvent) {
		if (content.length && (channel || dm) && e.code === "Enter") {
			if (channel)
				socket?.emit("channelChat", {
					user: {
						id: user.id,
						name: user.name,
						status: user.status,
						imageURL: user.imageURL,
					},
					content,
					channel,
				});
			else if (dm) {
				socket?.emit("dm", {
					sender: user,
					receiverName: dm,
					content,
				});
			}
			setContent("");
		}
	}
	return (
		<div className="chat-display d-flex column justify-between">
			<h3>{channel ? channel : dm ? dm : "Please join chat:)"}</h3>
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
			{(channel || dm) && (
				<div className="message">
					<InputField
						type="text"
						name="message"
						state={content}
						setState={setContent}
						onKeyUp={onKeyUp}
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
					line-break:anywhere;
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

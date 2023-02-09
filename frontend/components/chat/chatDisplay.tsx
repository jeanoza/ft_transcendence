import { useEffect, useRef, useState } from "react";
import { useUser } from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";
import { InputField } from "../inputField";

export function ChatDisplay({ channel }: { channel: string | null }) {
	const { socket } = useSocket("chat");
	const { user } = useUser();
	const [message, setMessage] = useState<string>("");
	const [received, setReceived] = useState<
		{ sender: string; message: string }[]
	>([]);
	const dialogueRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		socket.on("getChannelChats", function (data) {
			setReceived(data);
		});
		return () => {
			socket.off("getChanelChats");
		};
	}, []);

	useEffect(() => {
		//FIXME: when user click(channel change) => request chat before(channelChat db)
		if (channel) socket.emit("joinChannel", { channelName: channel, user });

		socket.on("recvMSG", function (data) {
			setReceived((prev) => [...prev, data]);
			ajustScroll();
		});

		return () => {
			socket.off("recvMSG");
		};
	}, [channel]);

	function ajustScroll() {
		const dialogueCont: HTMLDivElement = dialogueRef.current as HTMLDivElement;
		dialogueCont.scrollTo(0, dialogueCont.scrollHeight); // scroll to last message
	}

	async function onKeydown(e: KeyboardEvent) {
		if (channel && e.code === "Enter") {
			socket?.emit("sendMSG", {
				sender: user.name,
				message,
				channel,
			});
			setMessage("");
		}
	}
	return (
		<div className="chat-display d-flex column justify-between">
			<h3>{channel ? channel : "Please join channel:)"}</h3>
			<div className="chat-display-dialogue" ref={dialogueRef}>
				{!received.length ? (
					<div />
				) : (
					received.map((el, index) => (
						<div key={index}>
							<span className="sender">{el.sender}:</span>
							<span>{el.message}</span>
						</div>
					))
				)}
			</div>
			<div className="message">
				<InputField
					type="text"
					name="message"
					state={message}
					setState={setMessage}
					onKeydown={onKeydown}
				/>
			</div>
			<style jsx>{`
				h3 {
					padding: 1rem;
					border-bottom: 1px solid var(--border-color);
				}
				.sender {
					font-weight: 600;
					margin-right: 1rem;
				}
				.chat-display {
					width: 100%;
				}
				.message {
					padding: 0 1rem;
				}
				.chat-display-dialogue {
					height: 100%;
					overflow-y: auto;
					padding: 1rem;
				}
			`}</style>
		</div>
	);
}

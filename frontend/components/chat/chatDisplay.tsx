import { RefObject, useRef, useState } from "react";
import { useUser } from "../../utils/hooks/swrHelper";
import { useSocket } from "../../utils/hooks/useSocket";
import { InputField } from "../inputField";

export function ChatDisplay(
	{ received, channel }: {
		received: { sender: string, message: string }[]
		channel: string | null
	}) {
	const { user } = useUser();
	const { socket } = useSocket('chat');
	const [message, setMessage] = useState<string>("");
	const dialogueRef = useRef<HTMLDivElement>(null);


	async function onKeydown(e: KeyboardEvent) {
		if (e.code === "Enter") {
			const dialogueCont: HTMLDivElement = dialogueRef.current as HTMLDivElement;
			socket?.emit("sendMSG", {
				sender: user.name,
				message,
				channel,
			});
			dialogueCont.scrollTo(0, dialogueCont.scrollHeight) // scroll to last message
			setMessage("");
		}
	}
	return (
		<div className="chat-display d-flex column justify-between">
			<div className="chat-display-dialogue" ref={dialogueRef}>
				{!received.length
					? <div />
					: received.map((el, index) => (
						<div key={index}>
							<span className="sender">{el.sender}:</span>
							<span>{el.message}</span>
						</div>
					))}
			</div>
			<InputField
				type="text"
				name="message"
				state={message}
				setState={setMessage}
				onKeydown={onKeydown}
			/>
			<style jsx>{`
				.sender {
					font-weight: 600;
					margin-right: 1rem;
				}
				.chat-display {
					width: 100%;
					padding: 0rem 1rem;
				}
				.chat-display-dialogue {
					padding: 1rem 0;
					overflow-y: auto;
				}
			`}</style>
		</div>
	)
}
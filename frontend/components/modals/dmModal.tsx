import React, { useEffect, useState } from "react";
import { InputField } from "../inputField";
import { useSocket } from "../../utils/hooks/useSocket";
import { useUser } from "../../utils/hooks/swrHelper";
import DOMPurify from "dompurify";

export function DmModal({
	receiverName,
	onClose,
}: {
	receiverName: string;
	onClose: any;
}) {
	const [content, setContent] = useState<string>("");
	const { socket } = useSocket("chat");
	const { user } = useUser();

	//FIXME: see if better way => how to use callback with socketio in nest server??

	async function onKeyUp(e: React.KeyboardEvent) {
		if (e.code === "Enter") handleSendDM();
	}
	async function handleSendDM() {
		if (!content.length)
			return window.alert("Impossible to send empty message");
		socket.emit("dm", {
			sender: user,
			receiverName,
			content: DOMPurify.sanitize(content),
		});
		onClose();
	}

	return (
		<div className="modal-background">
			<div className="modal-container">
				<h3>new DM</h3>
				<div></div>
				<InputField
					type="text"
					name="message"
					state={content}
					setState={setContent}
					onKeyUp={onKeyUp}
				/>
				<div className="d-flex justify-end gap">
					<button onClick={handleSendDM}>Send</button>
					<button onClick={onClose}>Cancel</button>
				</div>
			</div>
		</div>
	);
}

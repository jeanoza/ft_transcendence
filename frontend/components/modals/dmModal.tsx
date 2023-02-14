import React, { useEffect, useState } from "react"
import { InputField } from "../inputField";
import { useSocket } from "../../utils/hooks/useSocket";
import { useUser } from "../../utils/hooks/swrHelper";

export function DmModal({ receiver, onClose }: { receiver: any, onClose: any }) {

	const [content, setContent] = useState<string>('');
	const { socket } = useSocket('chat');
	const { user } = useUser();

	//FIXME: see if better way => how to use callback with socketio in nest server??

	async function onKeydown(e: React.KeyboardEvent) {
		if (e.code === 'Enter') handleSendDM();
	}
	async function handleSendDM() {
		if (!content.length) return window.alert('Impossible to send empty message')
		socket.emit('dm', { sender: user, receiver, content });
		onClose();
	}

	return <div className="modal-background">
		<div className="modal-container">
			<h3>new DM</h3>
			<div></div>
			<InputField type="text" name="message" state={content} setState={setContent} onKeydown={onKeydown} />
			<div className="d-flex justify-end gap">
				<button onClick={handleSendDM}>Send</button>
				<button onClick={onClose}>Cancel</button>
			</div>
		</div>
	</div>
}
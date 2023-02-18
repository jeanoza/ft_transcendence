import { useEffect, useState } from "react"
import { InputField } from "../inputField";
import { useSocket } from "../../utils/hooks/useSocket";
import { useAllChannel, useUser } from "../../utils/hooks/swrHelper";

export function ChatModal({ onClose }: { onClose: any }) {

	const [name, setName] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const { socket } = useSocket('chat');
	const { user } = useUser();
	const { revalid } = useAllChannel();

	//FIXME: see if better way => how to use callback with socketio in nest server??
	useEffect(() => {
		socket.on('channelRegistered', () => {
			revalid();
			setName('');
			setPassword('');
			onClose();
		})
		return () => { socket.off('channelRegistered') }
	}, [])

	function onSubmit() {
		const channel = {
			name,
			password,
			isPublic: password.length ? false : true
		}
		if (!name.length) return window.alert('Put channel name!')
		socket.emit('newChannel', { channel, userId: user.id })
	}

	return <div className="modal-background">
		<div className="modal-container">
			<h3>New Chat</h3>
			<div></div>
			<InputField type="text" name="name" state={name} setState={setName} />
			<InputField type="password" name="password" state={password} setState={setPassword} />
			<div className="d-flex justify-end gap">
				<button onClick={onSubmit}>Join</button>
				<button onClick={onClose}>Cancel</button>
			</div>
		</div>
	</div>
}
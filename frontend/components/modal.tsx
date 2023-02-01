import { useEffect, useState } from "react"
import { InputField } from "./inputField";
import { useSocket } from "../utils/hooks/useSocket";
import { useUser } from "../utils/hooks/swrHelper";

export function Modal({ modal, setModal }: { modal: boolean, setModal: any }) {

	const [name, setName] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const { socket } = useSocket('chat');
	const { user } = useUser();

	function onClose() {
		setModal(false);
	}

	//FIXME: see if better way??
	useEffect(() => {
		socket.on('channelRegistered', () => {
			setName('');
			setPassword('');
			onClose();
		})
		console.log('here')
		return () => { socket.off('channelRegistered') }
	}, [])

	function onClick() {
		const channel = {
			name,
			password,
			isPublic: password.length ? false : true
		}
		if (!name.length) return window.alert('Put channel name!')
		socket.emit('newChannel', { channel, userId: user.id }, () => {
			setName('');
			setPassword('');
			onClose();
		})
	}

	if (!modal) return null;
	return <div className="modal-background d-flex center">
		<div className="modal-container">
			<h3>New Chat</h3>
			<div></div>
			<InputField type="text" name="name" state={name} setState={setName} />
			<InputField type="password" name="password" state={password} setState={setPassword} />
			<div className="d-flex justify-end gap">
				<button onClick={onClick}>Join</button>
				<button onClick={onClose}>Cancel</button>
			</div>
		</div>
		<style jsx>{`
			.modal-background {
				width:100%;
				height:100%;
				background-color:rgb(100,100,100,0.5);
				position:absolute;
				top:0px;
				left:0px;
			}
			.modal-container {
				background-color:white;
				padding:1rem;
				width:300px;
				border-radius:8px;
			}
		`}</style>
	</div>
}
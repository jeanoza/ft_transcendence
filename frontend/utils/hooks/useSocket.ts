import { Socket, io } from "socket.io-client";

const socket: { [key: string]: Socket } = {};

export function useSocket(type: string) {
	if (!socket[type]) {
		socket[type] = io(`http://localhost:8888/ws-${type}`);
		socket[type].on("error", function (e) {
			window.alert(e.message);
		});
	}
	return {
		socket: socket[type],
		connected: socket[type].connected,
	};
}

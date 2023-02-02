import { Socket, io } from "socket.io-client";
import { useUser } from "./swrHelper";

const socket: { [key: string]: Socket } = {};

export function useSocket(type: string) {
	if (!socket[type]) {
		socket[type] = io(`http://localhost:8888/ws-${type}`);
		socket[type].on("connect", function () {
			console.log(`[${type}] socket connected: ${socket[type]?.id}`);
		});
		socket[type].on("error", function (e) {
			//console.log(`[${type}] error`, e);
			window.alert(e.message);
		});
		socket[type].on("disconnect", function () {
			console.log(`[${type}] socket disconnected :${socket[type]?.id}`);
		});
	}
	return {
		socket: socket[type],
		connected: socket[type].connected,
	};
}

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSocket } from "../../utils/hooks/useSocket";
import { LiveGameElement } from "./liveGameElement";
import { PlayButton } from "./playButton";

export function LiveGameList() {
	const { socket } = useSocket("game");
	const [liveList, setLiveList] = useState<any[] | null>(null);

	useEffect(() => {
		socket.emit("getLiveGameList");
		socket.on("liveGameList", function (data) {
			if (data.length) setLiveList(data);
			else setLiveList(null);
		});
		return () => {
			socket.off("liveGameList");
		};
	}, []);
	return (
		<div className="live-game-container p-2">
			<h2>Live game</h2>
			{liveList && (
				<ul className="list my-4">
					{liveList.map((live) => {
						const roomName = live[0];
						const home = live[1].home;
						const away = live[1].away;
						if (!home || !away) return null;
						return (
							<LiveGameElement
								key={roomName}
								roomName={roomName}
								home={home}
								away={away}
							/>
						);
					})}
				</ul>
			)}
			<PlayButton />
			<style jsx>{`
				.live-game-container {
					min-width: 18rem;
					width: 30%;
					height: 100%;
					overflow: none auto;
					border: 1px solid var(--border-color);
					border-radius: 8px;
				}
				@media screen and (max-width: 512px) {
					.live-game-container {
						min-width:0px;
						width:100%;
					}
				}
			`}</style>
		</div>
	);
}

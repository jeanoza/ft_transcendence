import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "../avatar";

interface IProps {
	roomName: string;
	home: IUser;
	away: IUser;
}

export function LiveGameElement({ roomName, home, away }: IProps) {
	function handleObserve() {
		console.log(roomName);
	}
	return (
		<li className="d-flex center gap">
			<div className="d-flex column center">
				<Avatar size="sm" url={home.imageURL} />
				<h4 className="my-2 text-overflow">{home.name}</h4>
			</div>
			<h3>VS</h3>
			<div className="d-flex column center">
				<Avatar size="sm" url={away.imageURL} />
				<h4 className="my-2 text-overflow">{away.name}</h4>
			</div>
			<div className="icon" onClick={handleObserve}>
				{/*<FontAwesomeIcon icon={["far", "eye"]} />*/}
				<FontAwesomeIcon icon="eye" />
			</div>
			<style jsx>{`
				.icon {
					font-size: 1.5rem;
				}
				.icon:hover {
					color: var(--accent);
				}
				h4 {
					width: 5rem;
					text-align: center;
				}
			`}</style>
		</li>
	);
}

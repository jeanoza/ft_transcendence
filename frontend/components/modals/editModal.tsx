import { useUser } from "../../utils/hooks/swrHelper";
import { Profile } from "./edit/profile";
import { TwoFactorSetting } from "./edit/twoFactorSetting";


export default function EditModal({ onClose }: { onClose: any }) {
	function handleClose(e: any) {
		if (e.target.classList.contains('modal-background')) onClose();
	}

	return (
		<div className="modal-background" onClick={handleClose}>
			<div className="modal-container d-flex justify-between gap">
				<div>
					<Profile />
				</div>
				<div>
					<TwoFactorSetting />
				</div>
			</div>
		</div >
	);
}

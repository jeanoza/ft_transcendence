import { useUser } from "../../utils/hooks/swrHelper";
import React from "react";
import { MatchHistory } from "./user/MatchHistory";

export function MatchModal({ onClose }: { onClose: any }) {
	const { user } = useUser();

	function handleClose(e: any) {
		if (e.target.classList.contains("modal-background")) onClose();
	}

	if (!user) return null;
	return (
		<div className="modal-background" onClick={handleClose}>
			<div className="modal-container">
				<MatchHistory userId={user.id} />
			</div>
			<style jsx>{``}</style>
		</div>
	);
}

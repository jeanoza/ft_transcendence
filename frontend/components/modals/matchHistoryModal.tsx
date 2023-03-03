import { useAllFriend, useUser } from "../../utils/hooks/swrHelper";
import React, { useState } from "react";

export function matchHistoryModal({ onClose }: { onClose: any }) {
	const { user } = useUser();


	function handleClose(e: any) {
		if (e.target.classList.contains("modal-background")) onClose();
	}

	if (!user) return null;
	return (
		<div className="modal-background" onClick={handleClose}>
			<div className="modal-container">

			</div>
			<style jsx>{`
				button.active {
					background-color: var(--bg-accent);
					color: white;
				}
				.modal-container {
					height: 400px;
				}
				.header {
					padding-bottom: 1rem;
					border-bottom: 1px solid var(--border-color);
					margin-bottom: 1rem;
				}
			`}</style>
		</div>
	);
}

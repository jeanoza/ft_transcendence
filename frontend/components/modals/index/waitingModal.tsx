import React, { useEffect, useState } from "react"

export function WaitingModal({ onClose }: { onClose: any }) {

	return <div className="modal-background">
		<div className="modal-container">
			<h3>Waiting player . . .</h3>
			<button onClick={onClose}>Close</button>
		</div>
	</div>
}
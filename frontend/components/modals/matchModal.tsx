import axios from "axios";
import { useUser } from "../../utils/hooks/swrHelper";
import React, { useEffect, useState } from "react";

export function MatchModal({ onClose }: { onClose: any }) {
	const { user } = useUser();

	useEffect(() => {

		getMatch();
		async function getMatch() {
			axios.get("match").then(res => {
				// this data is ordered by date(descendant)
				// res.data[0] is the more recent match
				// put this data in state with setState
				// then do your self what you want!
				console.log(res.data);
			})
		}
	}, [])


	function handleClose(e: any) {
		if (e.target.classList.contains("modal-background")) onClose();
	}

	if (!user) return null;
	return (
		<div className="modal-background" onClick={handleClose}>
			<div className="modal-container">
			</div>
			<style jsx>{`
			
			`}</style>
		</div>
	);
}

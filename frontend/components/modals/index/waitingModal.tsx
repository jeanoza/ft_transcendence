import { Spinner } from "../../spinner";

export function WaitingModal({ onClose }: { onClose: any }) {
	return <div className="modal-background">
		<div className="modal-container">
			<h2>Matching</h2>
			<div className="spinner-container d-flex center center gap">
				<Spinner />
			</div>
			<div className="button-container d-flex justify-end">
				<button onClick={onClose}>Close</button>
			</div>
		</div>
		<style jsx>{`
			.modal-container{
				width:20rem;
			}
			.spinner-container {
				width:100%;
				margin:2rem 0;
			}
		`}</style>
	</div>
}
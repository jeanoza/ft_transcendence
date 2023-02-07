export function UserModal() {
	return <div className="modal-container">
		<h3>Modal</h3>
		<style jsx>{`
			.modal-container{
				position:fixed;
				top:0;
				left:0;
				width:100%;
				height:100%;
				background-color:rgb(220,220,220, 0.5);
			}
			`}</style>
	</div>
}
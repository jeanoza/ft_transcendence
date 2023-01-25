export function Layout({ children }: React.PropsWithChildren) {
	return (
		<div className="container">
			{children}
			<style jsx global>{`
				.container {
					height:100vh;
				}			
				main {
					margin: 2rem auto;
					width: 50%;
					height: calc(100vh - 96px);
					min-width: 400px;
					/*border:1px solid grey;*/
					border-radius:8px;
				}
			`}</style>
		</div>
	);
}

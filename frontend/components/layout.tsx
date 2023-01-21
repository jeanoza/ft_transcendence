export function Layout({ children }: React.PropsWithChildren) {
	return (
		<div>
			<div className="container">{children}</div>
			<style jsx global>{`
				.container {
					height:100vh;
				}
				main {
					margin: 0 auto;
					width: 50%;
					min-width: 400px;
				}
			`}</style>
		</div>
	);
}

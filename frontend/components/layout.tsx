export function Layout({ children }: React.PropsWithChildren) {
	return (
		<div>
			<div className="container">{children}</div>
			<style jsx global>{`
				main {
					height:100vh;
					margin: 0 auto;
					padding-top: 46px;
					width: 50%;
					min-width: 400px;
				}
			`}</style>
		</div>
	);
}

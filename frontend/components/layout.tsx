export function Layout({ children }: React.PropsWithChildren) {
	return (
		<div>
			<div className="container">{children}</div>
			<style jsx global>{`
				main {
					width: 50%;
					min-width: 400px;
					margin: auto;
				}
			`}</style>
		</div>
	);
}

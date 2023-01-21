export function Layout({ children }: React.PropsWithChildren) {
	return (
		<div>
			<div className="container">{children}</div>
			<style jsx global>{`
				main {
					margin: auto;
					margin-top: 46px;
					width: 50%;
					min-width: 400px;
				}
			`}</style>
		</div>
	);
}

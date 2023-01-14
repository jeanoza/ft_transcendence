import Navbar from "./navbar";

export function Layout({ children }: React.PropsWithChildren) {
	return (
		<div>
			{/*<Navbar />*/}
			<div className="container">{children}</div>
			<style jsx global>{`
				.container > main {
					width: 50%;
					min-width: 400px;
				}
			`}</style>
		</div>
	);
}

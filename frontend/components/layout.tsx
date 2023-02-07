import { use2fa, useUser } from "../utils/hooks/swrHelper";
import { Loader } from "./loader";
import { Navbar } from "./navbar";

export function AuthLayout({ children }: React.PropsWithChildren) {
	const { user, isLoading } = useUser();
	const { is2faAuthed, isLoading: is2faLoading } = use2fa();

	if (isLoading || is2faLoading)
		return (
			<div className="container">
				<Loader />
			</div>
		);

	return (
		<div className="container">
			<Navbar />
			{user && is2faAuthed && children}
			<style jsx global>{`
				.container {
					height: 100vh;
				}
				main {
					margin: 2rem auto;
					width: 50%;
					height: calc(100vh - 96px);
					min-width: 400px;
					border-radius: 8px;
				}
				@media screen and (max-width: 1024px) {
					main {
						width: 100%;
						height: calc(100vh - 48px);
						margin: 0 0;
						padding: 1rem;
					}
				}
			`}</style>
		</div>
	);
}

export function Layout({ children }: React.PropsWithChildren) {
	return (
		<div className="container">
			{children}
			<style jsx global>{`
				.container {
					height: 100vh;
				}
				main {
					margin: 2rem auto;
					width: 50%;
					height: calc(100vh - 96px);
					min-width: 400px;
					border-radius: 8px;
				}
				@media screen and (max-width: 1024px) {
					main {
						width: 100%;
						height: calc(100vh - 48px);
						margin: 0 0;
						padding: 1rem;
					}
				}
			`}</style>
		</div>
	);
}

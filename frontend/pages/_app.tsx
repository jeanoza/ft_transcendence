import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "../components/layout";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

//export default function App({
//	Component,
//	pageProps: { session, ...pageProps },
//}: AppProps<{ session: Session }>) {
export default function App({ Component, pageProps }: AppProps) {
	return (
		<Layout>
			{/*<SessionProvider>*/}
			<Component {...pageProps} />
			{/*</SessionProvider>*/}
		</Layout>
	);
}

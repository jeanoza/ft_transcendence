import React, { useEffect, useState } from "react";
import { Seo } from "../components/seo";
import { Layout } from "../components/layout";
import { NotAuthNavbar } from "../components/navbar";
import { AuthForm } from "../components/auth/authForm";

export function getStaticProps() {
	return { props: { authUrl: process.env.AUTH42_AUTH_URL } };
}
export default function Auth({ authUrl }: { authUrl: string }) {
	return (
		<Layout>
			<NotAuthNavbar />
			<Seo title="Auth" />
			<main className="d-flex column center">
				<h1>Auth</h1>
				<AuthForm authUrl={authUrl} />
			</main>
			<style jsx>{`
				main {
					flex-direction:column;
				}
			`}</style>
		</Layout>
	);
}

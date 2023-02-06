import React, { useEffect, useState } from "react";
import { Seo } from "../components/seo";
import { Layout } from "../components/layout";
import { AuthForm } from "../components/auth/authForm";

export function getServerSideProps({ req }: any) {
	const accessToken = req.cookies["accessToken"] || null;
	if (accessToken) {
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
			props: {},
		};
	}
	return { props: {} };
}

export default function Auth() {
	return (
		<Layout>
			<Seo title="Auth" />
			<main className="d-flex column center">
				<h1>Auth</h1>
				<AuthForm />
			</main>
		</Layout>
	);
}

import React, { useEffect, useState } from "react";
import { Seo } from "../components/seo";
import { Layout } from "../components/layout";
import { AuthForm } from "../components/auth/authForm";
import { NotAuthNavbar } from "../components/navbar";

export default function Auth() {
	return (
		<Layout>
			<NotAuthNavbar />
			<Seo title="Auth" />
			<main className="d-flex column center">
				<h1>Auth</h1>
				<AuthForm />
			</main>
		</Layout>
	);
}

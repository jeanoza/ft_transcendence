import React, { useEffect, useState } from "react";
import { Seo } from "../components/seo";
import { Layout } from "../components/layout";
import { NotAuthNavbar } from "../components/navbar";
import { AuthForm } from "../components/auth/authForm";

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

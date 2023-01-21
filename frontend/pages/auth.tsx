import React, { useEffect, useState } from "react";
import { Seo } from "../components/seo";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { Layout } from "../components/layout";
import { useUser } from "../utils/hooks/useUser";
import { NotAuthNavbar } from "../components/navbar";
import { AuthForm } from "../components/auth/authForm";

//type UserData = {
//	name: string;
//	email: string;
//	imageURL: string;
//};

export default function Auth() {
	return (
		<Layout>
			<NotAuthNavbar />
			<Seo title="Auth" />
			<main>
				<h1>Auth</h1>
				<AuthForm />
			</main>
		</Layout>
	);
}

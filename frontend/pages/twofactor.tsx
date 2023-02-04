import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { Navbar } from "../components/navbar";
import { Layout } from "../components/layout";
import { Loader } from "../components/loader";
import axios from "axios";
import { useEffect, useState } from "react";

export function getServerSideProps({ req }: any) {
	const accessToken = req.cookies["accessToken"] || null;
	if (!accessToken) {
		return {
			redirect: {
				permanent: false,
				destination: "/auth",
			},
			props: {},
		};
	}
	return { props: {} };
}
export default function TwoFactor() {
	const { user, isLoading } = useUser();
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	console.log(user);

	async function generate2faQR() {
		await axios
			.get("2fa/generate", {
				responseType: "arraybuffer",
			})
			.then((res) => {
				const base64 = btoa(
					new Uint8Array(res.data).reduce(
						(data, byte) => data + String.fromCharCode(byte),
						""
					)
				);
				setImageSrc(`data:;base64,${base64}`);
			});
	}

	async function disable2fa() {}

	async function enable2fa() {
		axios.post("");
	}
	return (
		<Layout>
			<Navbar />
			<Seo title="Twofactor" />
			{isLoading && <Loader />}
			{user && (
				<main>
					<h1 className="">Test page for test twofactor</h1>
					<div className="d-flex gap">
						<button onClick={generate2faQR}>Generate</button>
						<button onClick={enable2fa}>on</button>
						<button onClick={disable2fa}>off</button>
					</div>
					<div>{imageSrc && <img src={imageSrc} alt="QR code" />}</div>
					<div></div>
				</main>
			)}
		</Layout>
	);
}

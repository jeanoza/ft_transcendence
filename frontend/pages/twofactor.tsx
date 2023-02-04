import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { Navbar } from "../components/navbar";
import { Layout } from "../components/layout";
import { Loader } from "../components/loader";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { InputField } from "../components/inputField";

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
	const { user, isLoading, revalid } = useUser();
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [twoFactorCode, setTwoFactorCode] = useState<string>("");

	async function generate2faQR() {
		try {
			const res = await axios.get("2fa/generate", {
				responseType: "arraybuffer",
			});

			const reader = new FileReader();
			reader.onloadend = () => {
				const base64 = reader?.result?.toString().split(",")[1];
				setImageSrc(`data:;base64,${base64}`);
			};
			reader.readAsDataURL(new Blob([res.data]));
		} catch (error) {
			console.error(error);
		}
	}

	async function switch2fa() {
		try {
			const path = "2fa/" + (user.twoFactorEnabled ? "disable" : "enable");
			await axios.post(path, {
				twoFactorCode,
			});
			revalid();
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}

	async function onSubmit2faCode(e: any) {
		if (e.code === "Enter") {
			try {
				await axios.post("2fa/authenticate", {
					twoFactorCode,
				});
				setTwoFactorCode("");
			} catch (e: AxiosError | any) {
				console.log(e.message);
				//window.alert(e.message);
			}
		}
	}

	return (
		<Layout>
			<Navbar />
			<Seo title="Twofactor" />
			{isLoading && <Loader />}
			{user && (
				<main className="d-flex column center">
					<h1 className="">Two Factor Auth</h1>
					<div className="d-flex gap">
						{/*{user.twofactorEnable && (*/}
						<button onClick={generate2faQR}>Generate</button>
						{/*)}*/}
						<button onClick={switch2fa}>
							{user.twoFactorEnabled ? "off" : "on"}
						</button>
					</div>
					<div>{imageSrc && <img src={imageSrc} alt="QR code" />}</div>
					<div>
						<InputField
							type="text"
							name="code"
							state={twoFactorCode}
							setState={setTwoFactorCode}
							onKeydown={onSubmit2faCode}
						/>
					</div>
				</main>
			)}
		</Layout>
	);
}

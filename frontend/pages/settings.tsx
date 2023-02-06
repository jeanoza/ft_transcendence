import { Seo } from "../components/seo";
import { use2fa, useUser } from "../utils/hooks/swrHelper";
import { AuthLayout, Layout } from "../components/layout";
import { Loader } from "../components/loader";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { InputField } from "../components/inputField";
import { Navbar } from "../components/navbar";

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
export default function Settings() {
	const { user, revalid } = useUser();
	const [imageSrc, setImageSrc] = useState<string | null>(null);
	const [_2faCode, set_2faCode] = useState<string>("");

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
			revalid("user");
		} catch (error) {
			console.error(error);
		}
	}

	async function switch2fa() {
		try {
			const path = "2fa/" + (user._2faEnabled ? "disable" : "enable");
			await axios.post(path, {
				_2faCode,
			});
			revalid("user");
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}

	return (
		<AuthLayout>
			<Seo title="Settings" />
			<main className="">
				<h1 className="">Two Factor Auth</h1>
				<div className="d-flex gap">
					<button onClick={generate2faQR}>Generate</button>
					{user?._2faSecret && (
						<button onClick={switch2fa}>
							{user?._2faEnabled ? "off" : "on"}
						</button>
					)}
				</div>
				<div>{imageSrc && <img src={imageSrc} alt="QR code" />}</div>
				<div>
					<InputField
						type="text"
						name="code"
						state={_2faCode}
						setState={set_2faCode}
					/>
				</div>
			</main>
		</AuthLayout>
	);
}

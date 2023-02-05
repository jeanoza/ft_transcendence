import { Seo } from "../components/seo";
import { useUser } from "../utils/hooks/swrHelper";
import { Layout } from "../components/layout";
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
	const { user, isLoading, revalid } = useUser();
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

			//revalid();
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}

	async function onSubmit2faCode(e: any) {
		if (e.code === "Enter") {
			try {
				const res = await axios.post("2fa/authenticate", {
					_2faCode,
				});
				console.log(res);
				set_2faCode("");
			} catch (e: AxiosError | any) {
				console.log(e.message);
				//window.alert(e.message);
			}
		}
	}

	return (
		<Layout>
			<Navbar />
			<Seo title="Settings" />
			{isLoading && <Loader />}
			{user && (
				<main className="">
					<h1 className="">Two Factor Auth</h1>
					<div className="d-flex gap">
						<button onClick={generate2faQR}>Generate</button>
						<button onClick={switch2fa}>
							{user._2faEnabled ? "off" : "on"}
						</button>
					</div>
					<div>{imageSrc && <img src={imageSrc} alt="QR code" />}</div>
					<div>
						<InputField
							type="text"
							name="code"
							state={_2faCode}
							setState={set_2faCode}
							onKeydown={onSubmit2faCode}
						/>
					</div>
				</main>
			)}
		</Layout>
	);
}

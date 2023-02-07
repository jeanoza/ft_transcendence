import axios from "axios";
import { useUser } from "../../../utils/hooks/swrHelper";
import { useState } from "react";
import { InputField } from "../../inputField";

export function TwoFactorSetting() {
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
	if (!user) return null
	return (
		<div>
			<h3>Two Factor</h3>
			<div className="d-flex center">{imageSrc && <img src={imageSrc} alt="QR code" />}</div>
			<div className="d-flex gap center">
				<button onClick={generate2faQR}>Generate</button>
				{user?._2faSecret && (
					<button onClick={switch2fa}>
						{user?._2faEnabled ? "off" : "on"}
					</button>
				)}
			</div>
			<div>
				<InputField
					type="text"
					name="code"
					state={_2faCode}
					setState={set_2faCode}
				/>
			</div>
			<style jsx>{`
				img{
					width:128px;
				}
				h3 {
					color:#424245;
					margin-bottom:1rem;
				}
			`}</style>
		</div>
	);
}
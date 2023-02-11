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
			revalid();
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
			revalid();
		} catch (e: any) {
			window.alert(e.response.data.message);
		}
	}

	if (!user) return null;
	return (
		<div className="twofactor-cont">
			<h3>Two Factor</h3>
			<div className="d-flex center">
				{imageSrc && <img src={imageSrc} alt="QR code" />}
			</div>
			<div className="d-flex gap center">
				<button onClick={generate2faQR}>Generate</button>
				{user._2faSecret && (
					<div
						onClick={switch2fa}
						className={`twofactor ${user._2faEnabled ? "enabled" : ""}`}
					>
						<div></div>
					</div>
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
				img {
					width: 128px;
				}
				h3 {
					color: var(--gray-dark);
					margin-bottom: 1rem;
				}
				.twofactor-cont {
					width:14rem;
				}
				.twofactor {
					width: 4rem;
					border-radius: 2rem;
					background-color: var(--border-color);
				}
				.twofactor.enabled {
					background-color: var(--accent);
				}
				.twofactor > div {
					width: 2rem;
					height: 2rem;
					background-color: white;
					border-radius: 50%;
					transition:all 0.2s linear;
				}
				.twofactor.enabled > div {
					transform: translateX(2rem);
				}
			`}</style>
		</div>
	);
}

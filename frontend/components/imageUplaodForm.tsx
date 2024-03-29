import React, { HTMLInputTypeAttribute, useState } from "react";
import { Loader } from "./loader";
import { useUser } from "../utils/hooks/swrHelper";
import axios from "axios";

export function ImageUploadForm() {
	const { revalid } = useUser();
	const [image, setImage] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const handleImageChange = (e: React.ChangeEvent<any>) => {
		const selectedFile = e.target.files[0];

		if (selectedFile && selectedFile.type.startsWith("image/")) {
			setImage(selectedFile);
		} else {
			window.alert("Invalid file type. Only image files are allowed.");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("image", image);
			const res = await axios.post("/user/avatar", formData);
			window.alert(res.data);
			revalid();
		} catch (err) {
			window.alert(err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) <Loader />;
	return (
		<form onSubmit={handleSubmit}>
			<div className="field">
				<label>image</label>
				<input type="file" onChange={handleImageChange} />
			</div>
			<button type="submit" disabled={loading}>
				Upload
			</button>
			<style jsx>{`
				form {
					width: 200px;
				}
			`}</style>
		</form>
	);
}

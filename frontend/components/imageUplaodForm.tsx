import { useState } from "react";
import { Loader } from "./loader";
import { useUser } from "../utils/hooks/swrHelper";
import axios from "axios";

export function ImageUploadForm() {
	const { revalid } = useUser();
	const [image, setImage] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const handleImageChange = (e) => {
		const selectedFile = e.target.files[0];

		if (selectedFile && selectedFile.type.startsWith("image/")) {
			setImage(selectedFile);
		} else {
			window.alert("Invalid file type. Only image files are allowed.");
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData();
		formData.append('image', image);
		try {
			const res = await axios.post('/user/avatar', formData);
			window.alert(res.data);
			revalid();
		} catch (err) {
			window.alert(err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) <Loader />
	return (
		<form onSubmit={handleSubmit}>
			<div className="field">
				<label>Upload</label>
				<input type="file" onChange={handleImageChange} />
			</div>
			<button type="submit" disabled={loading}>
				Upload
			</button>
		</form>
	);
};

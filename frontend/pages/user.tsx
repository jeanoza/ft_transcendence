import React, { useEffect, useState } from "react";
import Seo from "../components/Seo";

export default function User() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {}, []);
	async function onClick(event: React.MouseEvent) {
		event.preventDefault();
		const data = {
			name,
			email,
		};
		console.log(data);
		//console.log(event);
		const res = await fetch("http://localhost:8888/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		console.log(res);
	}
	function onChange(event: React.ChangeEvent<HTMLInputElement>) {
		const target = event.currentTarget;
		if (target.classList.contains("name")) setName(target.value);
		else if (target.classList.contains("email")) setEmail(target.value);
	}
	return (
		<>
			<Seo title="User" />
			<main>
				<h1>User</h1>
				<div>
					<h3>Request test</h3>
					<form>
						<div>
							<label>name</label>
							<input onChange={onChange} className="name" />
						</div>
						<div>
							<label>email</label>
							<input onChange={onChange} className="email" />
						</div>
						<div className="btnContainer">
							<button type="submit" onClick={onClick}>
								Create
							</button>
							<button onClick={onClick}>Update</button>
						</div>
					</form>
				</div>
				<style jsx>{`
					form {
						display: flex;
						flex-direction: column;
					}
				`}</style>
			</main>
		</>
	);
}

import React, { useEffect, useState } from "react";
import Seo from "../components/Seo";

type userData = {
	id?: number;
	name?: string;
	email?: string;
};

export default function User() {
	const [userData, setUserData] = useState<userData[]>([]);
	const [id, setId] = useState<number>(0);
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");

	useEffect(() => {
		(async function () {
			const users = await (await fetch("http://localhost:8888/user")).json();
			setUserData(users);
		})();
	}, []);

	async function onClick(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		const targetName = e.currentTarget.name;

		if (targetName === "create" || (targetName === "update" && id > 0)) {
			let url = "http://localhost:8888/user/";
			let method = "POST";
			if (targetName === "update") {
				url += id;
				method = "PATCH";
			}
			const data = {
				name,
				email,
			};

			const res = await (
				await fetch(url, {
					method,
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				})
			).json();

			//re-render after fetch
			if (res.error) console.error(res.message);
			else if (targetName === "update")
				setUserData((before) => {
					return [...before.filter((el) => el.id !== id), { id, ...data }];
				});
			else setUserData((before) => [...before, { id: res, ...data }]);

			//after update empty each input
			setName("");
			setEmail("");
			setId(0);
		}
	}

	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.currentTarget;
		if (name === "name") setName(value);
		else if (name === "email") setEmail(value);
		else if (name === "id") setId(Number(value));
	}
	return (
		<>
			<Seo title="User" />
			<main>
				<h1>User</h1>
				<div>
					<h3>Request test</h3>
					<div>
						<h4>list</h4>
						{userData &&
							userData.map((el, id) => {
								return (
									<div key={id}>
										<span>id:{el.id}</span>
										<span>name: {el?.name}</span>
										<span>email: {el?.email}</span>
									</div>
								);
							})}
					</div>
					<form>
						<div>
							<label>name</label>
							<input onChange={onChange} name="name" value={name} />
						</div>
						<div>
							<label>email</label>
							<input onChange={onChange} name="email" value={email} />
						</div>
						<div>
							<label>id</label>
							<input type="number" onChange={onChange} name="id" value={id} />
						</div>
						<div className="btnContainer">
							<button type="submit" name="create" onClick={onClick}>
								Create
							</button>
							<button type="submit" name="update" onClick={onClick}>
								Update
							</button>
							<button type="submit" name="delete" onClick={onClick}>
								Delete
							</button>
						</div>
					</form>
				</div>
				<style jsx>{`
					form {
						display: flex;
						flex-direction: column;
					}
					div {
						margin: 16px 0px;
					}
					span {
						margin: 0 16px;
					}
				`}</style>
			</main>
		</>
	);
}

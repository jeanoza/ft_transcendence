import axios from "axios";
import React, { useEffect, useState } from "react";

export function Search() {
	const [name, setName] = useState<string>("");
	const [users, setUsers] = useState([]);

	async function getUserList() {
		try {
			console.log(name);
			const res = await axios.get(`/user/${name}`);
			setUsers(res.data);
		} catch (e) {
			console.log(e);
		}
	}

	useEffect(() => {
		if (name.length > 3) {
			getUserList();
		}
	}, [name]);

	function onChange(e: any) {
		setName(e.target.value);
	}

	return (
		<div className="search">
			<input value={name} onChange={onChange} />
			{users.length ? (
				<ul className="user-list">
					{users.map((el: any) => (
						<li key={el.id}>{el?.name}</li>
					))}
				</ul>
			) : null}
			<style jsx>{`
				.search {
					position: relative;
				}
				.user-list {
					position: absolute;
					top: 1.5rem;
					left: 0;
					background-color: white;
					padding: 1rem;
				}
			`}</style>
		</div>
	);
}

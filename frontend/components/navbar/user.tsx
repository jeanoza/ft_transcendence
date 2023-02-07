import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useUser } from "../../utils/hooks/swrHelper";

export function User() {
	const { user } = useUser();
	const [visible, setVisible] = useState<boolean>(false);
	const router = useRouter();
	const [tab, setTab] = useState<string>("");

	function switchTab(e) {
		console.log(e.target.id);
	}

	async function onLogout(e: React.MouseEvent<HTMLButtonElement>) {
		try {
			await axios.get("auth/logout");
			router.push("auth");
		} catch (err) {
			throw err;
		}
	}
	function onToggle(e: any) {
		// toggle only when target is not btns in user menu
		const target = e.target;
		if (!target.id) setVisible((prev) => !prev);
	}
	return (
		<div className="user d-flex center gap justify-between" onClick={onToggle}>
			<div
				className="avatar"
				style={{
					backgroundImage: `url(${user.imageURL ? user.imageURL : "/default_profile.png"
						})`,
				}}
			/>
			<div className="user-info">
				<span> {user.name}</span>
				<span className="email">({user.email})</span>
			</div>
			{visible && (
				<div className="user-menu d-flex">
					<div>here</div>
					<ul>
						<li>
							<span onClick={switchTab} id="Setting">
								settings
							</span>
						</li>
						<li>
							<span onClick={onLogout}>Logout</span>
						</li>
					</ul>
				</div>
			)}
			<style jsx>{`
				.user {
					cursor: pointer;
				}
				.avatar {
					width: 3rem;
					height: 3rem;
				}
				.user-menu {
					position: absolute;
					top: 39px;
					right: 0rem;
					border: 1px solid rgb(200, 200, 200);
				}
				.user-menu > ul {
					background-color: rgb(100, 100, 100);
					color: white;
				}
				.user-menu li {
					padding: 1rem;
				}
				.user-menu li:hover {
					background-color: rgb(200, 200, 200);
				}
				@media screen and (max-width: 1024px) {
					.email {
						display: none;
					}
				}
			`}</style>
		</div>
	);
}

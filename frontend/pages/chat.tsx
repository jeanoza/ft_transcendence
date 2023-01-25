import { useState } from "react";
import { Layout } from "../components/layout";
import { Loader } from "../components/loader";
import { Navbar } from "../components/navbar";
import { Seo } from "../components/seo";
import { TextareaField } from "../components/textareaField";
import { useUser } from "../utils/hooks/swrHelper";
import { InputField } from "../components/inputField";
import axios from "axios";

export function getServerSideProps({ req }: any) {
	const accessToken = req.cookies["accessToken"] || null;
	if (!accessToken) {
		delete axios.defaults.headers.common.Authorization;
		return {
			redirect: {
				permanent: false,
				destination: "/auth",
			},
			props: {},
		}
	}
	return { props: {} };
}
export default function Chat() {
	const { user, isLoading } = useUser();
	const [message, setMessage] = useState<string>('');
	return (
		<Layout>
			<Navbar />
			<Seo title="Chat" />
			{isLoading && <Loader />}
			{user &&
				<main>
					<div className="chat d-flex justify-between">
						<div className="chat-channels">
							<div>bla</div>
							<div>bla</div>
							<div>bla</div>
						</div>
						<div className="chat-display d-flex column justify-between">
							<div className="chat-display-dialogue">
								bla
							</div>
							<InputField type="text" name="message" state={message} setState={setMessage} />
						</div>
						<div className="chat-users">
						</div>
					</div>

				</main>
			}
			<style jsx>{`
			main {
				/*width:80%;*/
			}
			.chat {
				height:100%;
				background-color:rgb(240,240,240);
				border-radius:8px;
			}
			.chat > div {
			}
			.chat-display {
				width:100%;
				border: 1px rgb(200,200,200);
				border-style: none solid none solid;
				padding:0rem 1rem;
			}
			.chat-channels,
			.chat-users{
				width:20rem;
				padding: 1rem;
				/*background-color:rgb(200,200,200)*/
			}
			.chat-display-dialogue {
				padding:1rem 0;
			}

		`}</style>
		</Layout>
	);
}

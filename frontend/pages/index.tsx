import Seo from "../components/Seo";
import axios from "axios";
import { BASE_URL } from "../utils/global";

export default function Home() {
	return (
		<>
			<Seo title="Home" />
			<main>
				<h1 className="">Home</h1>
			</main>
		</>
	);
}

import Seo from "../components/Seo";
import { useRouter } from "next/router";

export default function Home() {
	const router = useRouter();

	//const {
	//	data: userData,
	//	mutate: revalid,
	//	isLoading,
	//} = useSWR("user", async (url) => {
	//	return await (
	//		await axios.get(url)
	//	).data;
	//});

	//console.log("home", userData);

	return (
		<>
			<Seo title="Home" />
			<main>
				<h1 className="">Home</h1>
			</main>
		</>
	);
}

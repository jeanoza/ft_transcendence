import Navbar from "./Navbar";
import { useRouter } from "next/router";
export default function Layout({ children }: React.PropsWithChildren) {
	return (
		<>
			<Navbar />
			<div>{children}</div>
		</>
	);
}

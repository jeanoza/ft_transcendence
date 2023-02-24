import "../styles/globals.css";
import type { AppProps } from "next/app";
import axios from "axios";
import { SWRConfig } from "swr";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faMagnifyingGlass,
	faXmark,
	faGear,
	faTrash,
	faUserMinus,
	faBan,
	faRotateLeft,
	faHandshakeSimple,
	faLockOpen,
	faUserPlus,
	faLocationArrow,
	faGamepad,
	faCircleInfo,
	faUniversalAccess,
	faInfo,
	faUser,
	faHand,
	faCommentSlash,
	faUserSlash,
	faCrown,
	faHammer,
} from "@fortawesome/free-solid-svg-icons";
import {
	faPaperPlane,
	faTrashCan,
	faCircleQuestion,
} from "@fortawesome/free-regular-svg-icons";

library.add(
	faHammer,
	faCrown,
	faUserSlash,
	faCommentSlash,
	faUser,
	faInfo,
	faCircleQuestion,
	faHand,
	faUniversalAccess,
	faGear,
	faMagnifyingGlass,
	faXmark,
	faGear,
	faTrash,
	faUserMinus,
	faBan,
	faRotateLeft,
	faHandshakeSimple,
	faLockOpen,
	faUserPlus,
	faLocationArrow,
	faGamepad,
	faCircleInfo,
	faPaperPlane,
	faTrashCan
);

axios.defaults.baseURL =
	process.env.NODE_ENV === "development"
		? "http://localhost:8888/api/"
		: "https://TO_PUT_URL_ON_PROD_LATER";
axios.defaults.withCredentials = true;

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SWRConfig>
			<Component {...pageProps} />
		</SWRConfig>
	);
}

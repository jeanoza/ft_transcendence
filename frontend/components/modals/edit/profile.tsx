import { useUser } from "../../../utils/hooks/swrHelper";
import { Avatar } from "../../avatar";
import { ImageUploadForm } from "../../imageUplaodForm";
import { UserInfo } from "../../userInfo";

export function Profile() {
	const { user } = useUser();

	return (
		<div className="d-flex column gap">
			<div className="d-flex center gap justify-between">
				<Avatar size="lg" url={user.imageURL} status={user.status} />
				<ImageUploadForm />
			</div>
			<UserInfo user={user} />
		</div >
	)
}
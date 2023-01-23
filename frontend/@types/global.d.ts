declare global {
	interface IUser {
		name?: string;
		email?: string;
		imageURL?: string;
		password?: string;
	}
	interface INote {
		id: 7;
		authorId: number;
		title: string;
		content: string;
		createdAt: string;
		updatedAt: string;
	}
}

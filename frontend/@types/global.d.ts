declare global {
	interface IUser {
		name?: string;
		email?: string;
		imageURL?: string;
		password?: string;
	}
	interface INote {
		id?: number;
		authorId?: number;
		title: string;
		content: string;
		createdAt?: string;
		updatedAt?: string;
	}
}

export { IUser, INote };

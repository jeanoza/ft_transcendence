declare global {
	interface IUser {
		id?: number;
		name?: string;
		email?: string;
		imageURL?: string;
		password?: string;
	}
	interface INote {
		id?: number;
		title: string;
		content: string;
		createdAt?: string;
		updatedAt?: string;
		authorId?: number;
		author?: IUser;
	}
}

export { IUser, INote };

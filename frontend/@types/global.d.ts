declare global {
	interface IUser {
		id?: number;
		name?: string;
		email?: string;
		imageURL?: string;
		password?: string;
		status?: number;
	}
	interface INote {
		id?: number;
		title: string;
		content: string;
		createdAt?: string | any;
		updatedAt?: string | any;
		authorId?: number;
		author?: IUser | null;
	}
}

export { IUser, INote };

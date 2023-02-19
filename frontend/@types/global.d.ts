declare global {
	interface IUser {
		id?: number;
		name?: string;
		email?: string;
		imageURL?: string;
		password?: string;
		status?: number;
		rank?: number;
		createdAt: string;
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

	interface IChannel {
		id: number;
		name: string;
		isPublic: boolean;
		ownerId: number;
		adminIds: number[];
	}
}

export { IUser, INote };

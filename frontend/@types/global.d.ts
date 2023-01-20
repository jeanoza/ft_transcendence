declare global {
	interface IUser {
		name?: string;
		email?: string;
		imageURL?: string;
		password?: string;
	}
}

export { IUser };

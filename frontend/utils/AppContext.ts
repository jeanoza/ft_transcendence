import { Dispatch, SetStateAction, createContext } from "react";

//Will be useful when wanna use React state globally

type User = {
	name: string;
	email: string;
};
type State = {
	logged: boolean;
	user: User;
};

type AppContext = {
	state: State;
	setLogged: Dispatch<SetStateAction<boolean>>;
	setUser: Dispatch<SetStateAction<User>>;
};
const AppContext = createContext<AppContext>(null!);

export default AppContext;

import { Dispatch, SetStateAction, createContext } from "react";

//Can use login variable globally	thanks for React Context

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

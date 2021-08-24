import { createContext, ReactNode } from 'react';
import useAuth from '../hooks/useAuth';

type UserData = {
    username: string;
    password: string;
}

type LoggedUser = {
    username: string;
}

type AuthContextData = {
    loggedUser: LoggedUser | null;
    loading: boolean;
    handleLogin: ({ username, password }: UserData) => Promise<void>;
    handleLogout: () => void;
}

const AuthContext = createContext({} as AuthContextData);

type AuthContextProps = {
    children: ReactNode;
}

function AuthContextProvider({ children }: AuthContextProps) {
    const {
        loggedUser, loading, handleLogin, handleLogout
    } = useAuth();

    return (
        <AuthContext.Provider value={{
            loggedUser,
            loading,
            handleLogin,
            handleLogout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };

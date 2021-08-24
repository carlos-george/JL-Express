import { createContext, ReactNode, useContext, useState } from "react";

type MenuContextData = {
    isHomeActive: boolean,
    isServcioActive: boolean,
    isAboutActive: boolean,
    isContatoActive: boolean,
    isLoginPage: boolean,
    isShowMenuApp: boolean,
    setActiveMenu: (value: string) => void,
    setLoginPage: (value: boolean) => void;
    setIsShowMenuApp: (value: boolean) => void;
}

export const MenuContext = createContext({} as MenuContextData);

type MenuContextProvider = {
    children: ReactNode,
}

export function MenuContextProvider({ children }: MenuContextProvider) {

    const [isHomeActive, setIsHomeActive] = useState(true);
    const [isServcioActive, setIsServicoActive] = useState(false);
    const [isAboutActive, setIsAboutActive] = useState(false);
    const [isContatoActive, setIsContatoActive] = useState(false);
    const [isLoginPage, setIsLoginPage] = useState<boolean>(false);
    const [isShowMenuApp, setIsShowMenuApp] = useState<boolean>(false);

    function setActiveMenu(value: string) {
        if (value === 'home') {
            setIsHomeActive(true);
            setIsServicoActive(false);
            setIsAboutActive(false);
            setIsContatoActive(false);
        }
        if (value === 'servico') {
            setIsHomeActive(false);
            setIsServicoActive(true);
            setIsAboutActive(false);
            setIsContatoActive(false);
        }
        if (value === 'about') {
            setIsHomeActive(false);
            setIsServicoActive(false);
            setIsAboutActive(true);
            setIsContatoActive(false);
        }
        if (value === 'contato') {
            setIsHomeActive(false);
            setIsServicoActive(false);
            setIsAboutActive(false);
            setIsContatoActive(true);
        }

    }

    function setLoginPage(value: boolean) {
        setIsLoginPage(value);
    }

    return (
        <MenuContext.Provider
            value={{
                isHomeActive,
                isServcioActive,
                isAboutActive,
                isContatoActive,
                isLoginPage,
                isShowMenuApp,
                setActiveMenu,
                setLoginPage,
                setIsShowMenuApp
            }}
        >
            {children}
        </MenuContext.Provider>
    );
}

export const useMenu = () => {
    return useContext(MenuContext);
}
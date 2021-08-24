import Router from 'next/router';
import Link from 'next/link';
import { FaWhatsapp, FaUser, FaAngleLeft, FaSignOutAlt } from 'react-icons/fa';
import { useMenu } from '../../context/MenuContext';
import classes from './styles.module.scss';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';

export function Header() {

    const {
        isHomeActive,
        isServcioActive,
        isAboutActive,
        isContatoActive,
        isLoginPage,
        isShowMenuApp,
        setLoginPage
    } = useMenu();

    const { handleLogout } = useAuth();

    const [isFrotaActive, setIsFrotaActive] = useState<boolean>(true);
    const [isUsuarioActive, setIsUsuarioActive] = useState<boolean>(false);

    useEffect(() => {
        setIsFrotaActive(true);
        setIsUsuarioActive(false);
    }, [])

    function handleLogin() {
        Router.push('/login');
    }

    function handleVoltaHome() {
        setLoginPage(false);
        Router.push('/');
    }

    return (
        <header className={classes.headerContainer}>
            <div className={classes.headerMenus}>
                {!isLoginPage
                    ? (
                        <>
                            <ul>
                                <li className={isHomeActive ? classes.active : ''}>
                                    <Link href="/#home">Home</Link>
                                </li>
                                <li className={isServcioActive ? classes.active : ''}>
                                    <Link href="/#servico">Serviços</Link>
                                </li>
                                <li className={isAboutActive ? classes.active : ''}>
                                    <Link href="/#about">Quem Somos</Link>
                                </li>
                                <li className={isContatoActive ? classes.active : ''}>
                                    <Link href="/#contato">Contato</Link>
                                </li>
                            </ul>
                            <div className={classes.containerButtons}>
                                <a className={classes.whatsapp} href="https://api.whatsapp.com/send?phone=556196771548&text=Ol%C3%A1!%20Gostaria%20de%20conhecer%20a%20JL%20EXPRESS." target="_blank">
                                    <FaWhatsapp size={30} color={'#ffffff'} />
                                </a>
                                <a className={classes.button} href="http://fpinovacoes.com.br/jltransp/" target="_blank">Rastrei sua carga aqui</a>
                                <div className={classes.buttonLogin}>
                                    <FaUser size={30} onClick={handleLogin} />
                                </div>
                            </div>
                        </>
                    )
                    : (
                        <div className={classes.headerMenusApp}>
                            <div className={classes.buttonVoltar} onClick={handleVoltaHome} >
                                <FaAngleLeft size={30} />
                                <span>Voltar</span>
                            </div>
                            {isShowMenuApp &&
                                <div className={classes.menus}>
                                    <ul>
                                        <li className={isFrotaActive ? classes.active : ''} onClick={() => {
                                            setIsFrotaActive(true);
                                            setIsUsuarioActive(false);
                                        }}>
                                            <Link href="/frota">Frota</Link>
                                        </li>
                                        <li className={isUsuarioActive ? classes.active : ''} onClick={() => {
                                            setIsFrotaActive(false);
                                            setIsUsuarioActive(true);
                                        }}>
                                            <Link href="/usuario">Usuários</Link>
                                        </li>
                                        <li onClick={() => {
                                            setIsFrotaActive(true);
                                            setIsUsuarioActive(false);
                                            handleLogout();
                                        }}>
                                            <FaSignOutAlt size={30} />
                                        </li>
                                    </ul>
                                </div>
                            }
                        </div>
                    )
                }
            </div>
        </header>
    );
}
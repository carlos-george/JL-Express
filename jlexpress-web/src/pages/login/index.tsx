import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

import classes from './styles.module.scss';
import { useMenu } from '../../context/MenuContext';
import useAuth from '../../hooks/useAuth';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

export default function Login() {

    const { enqueueSnackbar } = useSnackbar();

    const { setLoginPage, setIsShowMenuApp } = useMenu();
    const { loading, handleLogin } = useAuth();
    const [values, setValues] = useState({
        username: '',
        password: '',
    })

    useEffect(() => {
        setLoginPage(true);
        setIsShowMenuApp(false);
    }, []);

    function handleOnChange(event: ChangeEvent<HTMLInputElement>) {

        setValues({
            ...values,
            [event.target.name]: event.target.value
        })

    }

    async function handleSubmiteForm(event: FormEvent) {
        event.preventDefault();


        try {
            await handleLogin(values);
        } catch (error) {
            console.debug('Error 2: ', error)
            console.debug('Error Message 2: ', error.message)
            const { message } = error;
            if (message) {
                console.debug('Mensagem 2: ', message);
                enqueueSnackbar(message, {
                    variant: 'warning'
                })
            }
        }
    }

    return (
        <div className={classes.container}>
            <div className={classes.containerLogin}>
                <img src="/logoJLExpress.png" alt="JL Express" />
                <form onSubmit={handleSubmiteForm}>
                    <div className={classes.inputGroup}>
                        <input
                            name="username"
                            required
                            type="text"
                            value={values.username}
                            placeholder="Usuário"
                            autoComplete="off"
                            onChange={event => { handleOnChange(event) }}
                        />
                    </div>
                    <div className={classes.inputGroup}>
                        <input
                            required
                            name="password"
                            type="password"
                            value={values.password}
                            placeholder="Senha"
                            autoComplete="off"
                            onChange={event => { handleOnChange(event) }}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {!loading
                            ? (<span>Entrar</span>)
                            : (<span>Processando...</span>)
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const { ['nextauth.token']: token } = parseCookies(ctx)

    if (token) {
        return {
            redirect: {
                destination: '/frota',
                permanent: true,
            }
        }
    }

    return {
        props: {}
    }
}
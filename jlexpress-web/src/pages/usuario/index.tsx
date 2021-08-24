
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useSnackbar } from 'notistack';
import { FaPlus, FaKey, FaUserCheck, FaUserTimes, FaTrashAlt } from 'react-icons/fa';
import { parseCookies } from "nookies";

import classes from './styles.module.scss';
import { api } from '../../services/api';
import { useMenu } from "../../context/MenuContext";

type FormField = {
    _id?: string,
    username: string,
    birthday: string,
    isActive: boolean,
}

type UsuarioProps = {
    isAuthenticated: boolean;
}

export default function Usuario({ isAuthenticated }: UsuarioProps) {

    const { enqueueSnackbar } = useSnackbar();

    const initialValues = {
        username: '',
        // birthday: (new Date()).toISOString().split('T').slice(0, -1).join('T'),
        birthday: format(new Date(), 'y-MM-dd'),
        isActive: true,
    }

    const { setLoginPage, setIsShowMenuApp } = useMenu();

    const currentDate = format(new Date(), 'dd/MM/y', {
        locale: ptBR
    });

    const [values, setValues] = useState<FormField>(initialValues);
    const [usuarios, setUsuarios] = useState<FormField[]>([]);
    const [isLoadingAdd, setIsLoadingAdd] = useState<boolean>(false);
    const [isLoadingEdit, setIsLoadingEdit] = useState<boolean>(false);

    useEffect(() => {
        setLoginPage(isAuthenticated);
        setIsShowMenuApp(isAuthenticated);
    }, []);

    useEffect(() => {
        atualizarListaUsuarios('');
    }, []);

    function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        })
    }

    function handleSubmiteForm(event: FormEvent) {
        event.preventDefault();

        setIsLoadingAdd(true);

        api.post('/api/users', values).then(response => {
            const { message } = response.data;
            enqueueSnackbar(message, {
                variant: 'success'
            });
            setIsLoadingAdd(false);
            atualizarListaUsuarios('');
            clearForm();
        }).catch(err => {
            if (err.response) {
                console.log('Error: ', err.response);
                const { message } = err.response.data;
                enqueueSnackbar(message, {
                    variant: 'warning'
                });
                setIsLoadingAdd(false);
            }
            else if (err.request) {
                console.log('Error: ', err.request);
                enqueueSnackbar('Verifique sua conexão com a internet.', {
                    variant: 'error'
                });
                setIsLoadingAdd(false);
            }
        });
    }

    function clearForm() {
        setValues(initialValues);
    }

    function handleEdit(usuario: FormField) {

        setValues(usuario);
    }

    function handleGerarSenha(id: string) {
        setIsLoadingEdit(true);

        api.put(`/api/users/generate-pass/${id}`, values).then(response => {
            const { message } = response.data;
            enqueueSnackbar(message, {
                variant: 'success'
            });
        }).catch(err => {
            if (err.response) {
                console.log('Error: ', err.response);
                const { message } = err.response.data;
                enqueueSnackbar(message, {
                    variant: 'warning'
                });
                setIsLoadingEdit(false);
            }
            else if (err.request) {
                console.log('Error: ', err.request);
                enqueueSnackbar('Verifique sua conexão com a internet.', {
                    variant: 'error'
                });
                setIsLoadingEdit(false);
            }
        });
    }

    function atualizarListaUsuarios(value: string) {
        setIsLoadingEdit(true);

        api.get(`/api/users?username=${value}`).then(response => {
            const { users } = response.data;
            const newList = users.map((user: any) => {
                const formatedDate = format(parseISO(user.birthday), 'd/MM/y', { locale: ptBR });
                return {
                    ...user,
                    birthday: formatedDate
                }
            });
            console.log('Lista Usuários: ', newList);
            setUsuarios(newList);
            setIsLoadingEdit(false);
        });
    }

    function handleDesactiveActiveUser(id: string) {
        setIsLoadingEdit(true);
        api.put(`/api/users/active-desactive/${id}`).then(response => {
            const { message } = response.data;
            enqueueSnackbar(message, {
                variant: 'success'
            });
            atualizarListaUsuarios('');
            clearForm();
        }).catch(err => {
            if (err.response) {
                console.log('Error: ', err.response);
                const { message } = err.response.data;
                enqueueSnackbar(message, {
                    variant: 'warning'
                });
                setIsLoadingEdit(false);
            }
            else if (err.request) {
                console.log('Error: ', err.request);
                enqueueSnackbar('Verifique sua conexão com a internet.', {
                    variant: 'error'
                });
                setIsLoadingEdit(false);
            }
        });
    }

    function handleResetPassword(id: string) {
        setIsLoadingEdit(true);
        api.put(`/api/users/reset-pass/${id}`).then(response => {
            const { message } = response.data;
            enqueueSnackbar(message, {
                variant: 'success'
            });
            clearForm();
        }).catch(err => {
            if (err.response) {
                console.log('Error: ', err.response);
                const { message } = err.response.data;
                enqueueSnackbar(message, {
                    variant: 'warning'
                });
                setIsLoadingEdit(false);
            }
            else if (err.request) {
                console.log('Error: ', err.request);
                enqueueSnackbar('Verifique sua conexão com a internet.', {
                    variant: 'error'
                });
                setIsLoadingEdit(false);
            }
        });
    }

    function handleDeleteUser(id: string) {
        setIsLoadingEdit(true);
        api.delete(`/api/users/${id}`).then(response => {
            const { message } = response.data;
            enqueueSnackbar(message, {
                variant: 'success'
            });
            atualizarListaUsuarios('');
            clearForm();
        }).catch(err => {
            if (err.response) {
                console.log('Error: ', err.response);
                const { message } = err.response.data;
                enqueueSnackbar(message, {
                    variant: 'warning'
                });
                setIsLoadingEdit(false);
            }
            else if (err.request) {
                console.log('Error: ', err.request);
                enqueueSnackbar('Verifique sua conexão com a internet.', {
                    variant: 'error'
                });
                setIsLoadingEdit(false);
            }
        });
    }

    return (
        <div className={classes.container} >
            <div className={classes.add}>
                <div className={classes.header}>
                    <h1>Cadastro de Usuário</h1>
                    <span>{currentDate}</span>
                </div>
                <form onSubmit={handleSubmiteForm}>
                    <div className={classes.formGroup}>
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
                                name="birthday"
                                required
                                type="date"
                                value={values.birthday}
                                autoComplete="off"
                                onChange={event => { handleOnChange(event) }}
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={isLoadingAdd}>
                        {!isLoadingAdd
                            ? (
                                <>
                                    <FaPlus size={13} />
                                    <span>Salvar</span>
                                </>
                            )
                            : (
                                <span>Processando...</span>
                            )
                        }
                    </button>
                </form>
            </div>
            <div className={classes.list}>
                <h1>Lista de Usuários</h1>
                {!isLoadingEdit
                    ? (
                        <div className={classes.cards}>
                            {usuarios.map(usuario => (
                                <div key={usuario._id} className={classes.card}>
                                    <div className={classes.cardGroup}>
                                        <label>Usuário: <span>{usuario.username}</span></label>
                                    </div>
                                    <div className={classes.cardGroup}>
                                        <label>D/A: <span>{usuario.birthday}</span></label>
                                    </div>
                                    <div className={classes.cardGroup}>
                                        <label>Ativo: <span>{usuario.isActive ? 'Ativo' : 'Desativado'}</span></label>
                                    </div>
                                    <div className={classes.cardGroup}>
                                        <div className={classes.cardIcons}>
                                            {!usuario.isActive
                                                ? <FaUserCheck size={18} onClick={() => handleDesactiveActiveUser(usuario._id!)} />
                                                : <FaUserTimes size={18} onClick={() => handleDesactiveActiveUser(usuario._id!)} />
                                            }
                                            <FaKey size={15} onClick={() => handleGerarSenha(usuario._id!)} />
                                            <FaTrashAlt size={15} onClick={() => handleDeleteUser(usuario._id!)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                    : (
                        <h2>Processando...</h2>
                    )
                }

            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const { ['nextauth.token']: token } = parseCookies(ctx)

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }

    return {
        props: {
            isAuthenticated: !!token
        }
    }
}

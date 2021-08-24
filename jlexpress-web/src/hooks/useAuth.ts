import { useState, useEffect, useCallback } from 'react';
import Router from 'next/router'
import { setCookie, parseCookies, destroyCookie } from 'nookies';

import { api } from '../services/api';

type UserData = {
    username: string;
    password: string;
}

type LoggedUser = {
    username: string;
}

export default function useAuth() {
    const [loading, setLoading] = useState(true);
    const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies();

        if (token) {

            api.get('/api/users/profile').then(response => {
                const { user } = response.data;
                setLoggedUser(user);
            })
        }

        setLoading(false);
    }, []);

    const handleLogin = useCallback(async ({ username, password }: UserData) => {
        setLoading(true);
        const formdata = {
            username,
            password
        };
        try {
            const { data: { user, token } } = await api.post('/api/users/authenticate', formdata);

            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 1, // 1 hour
            });

            setLoggedUser(user);
            setLoading(false);

            api.defaults.headers.Authorization = `Bearer ${token}`;

            Router.push('/frota');
        } catch (error) {
            console.debug('Error 1: ', error);
            console.debug('Error Response 1: ', error.response);
            setLoading(false);
            const { message } = error.response.data;
            throw new Error(message);
        }
    }, []);

    const handleLogout = useCallback(() => {
        destroyCookie(undefined, 'nextauth.token');
        setLoggedUser(null);
        api.defaults.headers.Authorization = undefined;
        setLoading(false);
        Router.push('/login');
    }, [])

    return { loggedUser, loading, handleLogin, handleLogout };
}
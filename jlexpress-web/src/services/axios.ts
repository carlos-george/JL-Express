import axios from "axios";
import { parseCookies } from "nookies";

export function getAPIClient(ctx?: any) {
    const { 'nextauth.token': token } = parseCookies(ctx)

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : 'http://localhost:3001'
    });

    if (token) {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
    }

    return api;
}
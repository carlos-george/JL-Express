import axios from 'axios';
import { AsyncStorage } from 'react-native';

const api = axios.create({
    baseURL: 'http://192.168.0.9:3001',
});

api.interceptors.request.use(async (config) => {

    const token = await AsyncStorage.getItem('@token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

}, error => {
    return Promise.reject(error);
});

export default api;
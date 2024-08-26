import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'https://book-exchange-platform-vf2q.onrender.com/api/v1',
    baseURL: 'http://localhost:5000/api/v1',
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

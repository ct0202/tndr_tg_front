import axios from "axios";

const instance = axios.create({
    // baseURL: "http://localhost:3001"
    // baseURL: "https://tinder-back-production.up.railway.app"
    baseURL: "https://api.godateapp.ru"
});

instance.interceptors.request.use((config) => {
    config.headers.Authorization = localStorage.getItem('token');
    return config
})

export default instance; 
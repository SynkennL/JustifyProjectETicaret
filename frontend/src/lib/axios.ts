import axios from "axios";
import type { AxiosInstance } from "axios";
import { toast } from "vue3-toastify";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

const api: AxiosInstance = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor - Token ekleme
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor - Hata yönetimi
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.error("Oturum süreniz doldu, lütfen tekrar giriş yapın!");
            window.location.href = "/login";
        }

        if (error.response?.status === 403) {
            toast.error("Bu işlem için yetkiniz bulunmuyor!");
        }

        if (error.response?.status === 404) {
            toast.error("İstenen kaynak bulunamadı!");
        }

        if (error.response?.status >= 500) {
            toast.error("Sunucu hatası! Lütfen daha sonra tekrar deneyin.");
        }

        return Promise.reject(error);
    }
);

export default api;

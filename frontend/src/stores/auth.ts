import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../lib/axios';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);
    const loading = ref(false);

    // Getters
    const isLoggedIn = computed(() => !!token.value);
    const isAdmin = computed(() => user.value?.role === 'admin');
    const userId = computed(() => user.value?.id || null);

    // Actions
    const init = () => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken) {
            token.value = storedToken;
        }
        if (storedUser) {
            user.value = JSON.parse(storedUser);
        }
    };

    const login = async (email: string, password: string) => {
        loading.value = true;
        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;

            if (data.error) {
                return { error: data.error };
            }

            token.value = data.token;
            user.value = data.user;

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return { success: true, user: data.user };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Giriş yapılırken bir hata oluştu.';
            return { error: message };
        } finally {
            loading.value = false;
        }
    };

    const register = async (name: string, email: string, password: string, role: string) => {
        loading.value = true;
        try {
            const response = await api.post('/auth/register', { name, email, password, role });
            const data = response.data;

            if (data.error) {
                return { error: data.error };
            }

            token.value = data.token;
            user.value = data.user;

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return { success: true, user: data.user };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Kayıt olurken bir hata oluştu.';
            return { error: message };
        } finally {
            loading.value = false;
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateProfile = async (data: { name: string; email: string; currentPassword?: string; newPassword?: string }) => {
        loading.value = true;
        try {
            const response = await api.patch('/auth/update-profile', data);
            const result = response.data;

            const updatedUser = {
                ...user.value,
                name: result.user.name,
                email: result.user.email
            } as User;

            user.value = updatedUser;
            localStorage.setItem('user', JSON.stringify(updatedUser));

            return { success: true, user: updatedUser };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Profil güncellenirken bir hata oluştu.';
            return { error: message };
        } finally {
            loading.value = false;
        }
    };

    // Initialize on store creation
    init();

    return {
        // State
        user,
        token,
        loading,
        // Getters
        isLoggedIn,
        isAdmin,
        userId,
        // Actions
        init,
        login,
        register,
        logout,
        updateProfile
    };
});

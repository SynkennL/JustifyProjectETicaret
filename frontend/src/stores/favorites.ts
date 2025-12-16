import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../lib/axios';

export const useFavoritesStore = defineStore('favorites', () => {
    // State
    const favoriteIds = ref<Set<number>>(new Set());
    const favorites = ref<any[]>([]);
    const loading = ref(false);

    // Getters
    const count = computed(() => favoriteIds.value.size);

    // Actions
    const isFavorite = (productId: number): boolean => {
        return favoriteIds.value.has(productId);
    };

    const loadIds = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                favoriteIds.value = new Set();
                return;
            }

            const response = await api.get('/favorites/ids');
            favoriteIds.value = new Set(response.data.favoriteIds || []);
        } catch (err) {
            console.error('Favoriler yüklenemedi:', err);
            favoriteIds.value = new Set();
        }
    };

    const fetchFavorites = async () => {
        loading.value = true;
        try {
            const response = await api.get('/favorites');
            favorites.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Favoriler yüklenemedi:', error);
            return [];
        } finally {
            loading.value = false;
        }
    };

    const add = async (productId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Giriş yapmalısınız');
            }

            await api.post('/favorites', { product_id: productId });
            favoriteIds.value.add(productId);
            return { success: true };
        } catch (err: any) {
            console.error('Favoriye eklenemedi:', err);
            return { error: err.response?.data?.error || 'Favoriye eklenemedi' };
        }
    };

    const remove = async (productId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Giriş yapmalısınız');
            }

            await api.delete(`/favorites/${productId}`);
            favoriteIds.value.delete(productId);
            return { success: true };
        } catch (err: any) {
            console.error('Favoriden çıkarılamadı:', err);
            return { error: err.response?.data?.error || 'Favoriden çıkarılamadı' };
        }
    };

    const toggle = async (productId: number) => {
        if (isFavorite(productId)) {
            return await remove(productId);
        } else {
            return await add(productId);
        }
    };

    const clear = () => {
        favoriteIds.value = new Set();
        favorites.value = [];
    };

    return {
        favoriteIds,
        favorites,
        loading,
        count,
        isFavorite,
        loadIds,
        fetchFavorites,
        add,
        remove,
        toggle,
        clear
    };
});

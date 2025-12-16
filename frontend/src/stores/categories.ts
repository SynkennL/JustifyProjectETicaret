import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../lib/axios';

interface Category {
    id: number;
    name: string;
    slug: string;
}

export const useCategoryStore = defineStore('categories', () => {
    // State
    const categories = ref<Category[]>([]);
    const loading = ref(false);

    // Actions
    const fetchCategories = async () => {
        loading.value = true;
        try {
            const response = await api.get('/categories');
            categories.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
            return [];
        } finally {
            loading.value = false;
        }
    };

    const createCategory = async (data: { name: string; slug: string }) => {
        try {
            const response = await api.post('/categories', data);
            categories.value.push(response.data);
            return { success: true, data: response.data };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Kategori eklenirken hata.';
            return { error: message };
        }
    };

    const deleteCategory = async (id: number) => {
        try {
            await api.delete(`/categories/${id}`);
            categories.value = categories.value.filter(c => c.id !== id);
            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Kategori silinemedi.';
            return { error: message };
        }
    };

    return {
        categories,
        loading,
        fetchCategories,
        createCategory,
        deleteCategory
    };
});

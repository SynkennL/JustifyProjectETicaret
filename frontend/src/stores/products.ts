import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../lib/axios';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discount_price?: number | null;
    image_url: string;
    category_id: number;
    category_name: string;
    category_slug: string;
    seller_id: number;
    seller_name?: string;
    seller_email?: string;
    features?: any;
}

export const useProductStore = defineStore('products', () => {
    // State
    const products = ref<Product[]>([]);
    const popularProducts = ref<Product[]>([]);
    const categoryProducts = ref<Product[]>([]);
    const currentProduct = ref<Product | null>(null);
    const loading = ref(false);
    const categoryLoading = ref(false);

    // Actions
    const fetchProducts = async (category?: string) => {
        loading.value = true;
        try {
            const url = category ? `/products?category=${category}` : '/products';
            const response = await api.get(url);
            products.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Ürünler yüklenirken hata:', error);
            return [];
        } finally {
            loading.value = false;
        }
    };

    const fetchPopularProducts = async () => {
        try {
            const response = await api.get('/products/popular');
            popularProducts.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Popüler ürünler yüklenirken hata:', error);
            return [];
        }
    };

    const fetchCategoryProducts = async (categorySlug: string, limit?: number) => {
        categoryLoading.value = true;
        try {
            const response = await api.get(`/products?category=${categorySlug}`);
            let data = response.data;
            if (limit) {
                data = data.slice(0, limit);
            }
            categoryProducts.value = data;
            return data;
        } catch (error) {
            console.error('Kategori ürünleri yüklenirken hata:', error);
            categoryProducts.value = [];
            return [];
        } finally {
            categoryLoading.value = false;
        }
    };

    const fetchProduct = async (id: number | string) => {
        loading.value = true;
        try {
            const response = await api.get(`/products/${id}`);
            currentProduct.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Ürün yüklenirken hata:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const createProduct = async (productData: any) => {
        loading.value = true;
        try {
            const response = await api.post('/products', productData);
            return { success: true, data: response.data };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Ürün eklenirken bir hata oluştu.';
            return { error: message };
        } finally {
            loading.value = false;
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            await api.delete(`/products/${id}`);
            products.value = products.value.filter(p => p.id !== id);
            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Ürün silinemedi.';
            return { error: message };
        }
    };

    const updateProduct = async (id: number, productData: any) => {
        try {
            const response = await api.patch(`/products/${id}`, productData);
            // Update local state
            const index = products.value.findIndex(p => p.id === id);
            if (index > -1) {
                products.value[index] = response.data;
            }
            return { success: true, data: response.data };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Ürün güncellenirken hata.';
            return { error: message };
        }
    };

    const filterByUserId = (userId: number | null | undefined) => {
        if (!userId) return products.value;
        return products.value.filter(p => p.seller_id !== userId);
    };

    return {
        products,
        popularProducts,
        categoryProducts,
        currentProduct,
        loading,
        categoryLoading,
        fetchProducts,
        fetchPopularProducts,
        fetchCategoryProducts,
        fetchProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        filterByUserId
    };
});

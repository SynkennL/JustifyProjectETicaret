import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../lib/axios';

interface CartItem {
    id: number;
    title: string;
    price: number;
    image?: string;
    sizes?: string[] | null;
    seller_id?: number | null;
    quantity: number;
}

export const useCartStore = defineStore('cart', () => {
    // State
    const items = ref<CartItem[]>([]);

    // Getters
    const totalPrice = computed(() => {
        return items.value.reduce((acc, item) => acc + item.price * item.quantity, 0);
    });

    const totalItems = computed(() => {
        return items.value.reduce((acc, item) => acc + item.quantity, 0);
    });

    const isEmpty = computed(() => items.value.length === 0);

    // Actions
    const init = () => {
        const stored = localStorage.getItem('cart');
        if (stored) {
            items.value = JSON.parse(stored);
        }
    };

    const save = () => {
        localStorage.setItem('cart', JSON.stringify(items.value));
    };

    const addItem = (product: Omit<CartItem, 'quantity'>) => {
        const productSizes = product.sizes || [];
        const sizeKey = Array.isArray(productSizes) ? productSizes.sort().join('|') : '';

        const existing = items.value.find(item => {
            const existingSizes = (item.sizes || []).sort().join('|');
            return item.id === product.id && existingSizes === sizeKey;
        });

        if (existing) {
            existing.quantity += 1;
        } else {
            items.value.push({ ...product, quantity: 1 });
        }
        save();
    };

    const updateQuantity = (productId: number, delta: number, sizes?: string[] | null) => {
        const sizesKey = (sizes || []).sort().join('|');
        const item = items.value.find(i => {
            const existingSizesKey = (i.sizes || []).sort().join('|');
            return i.id === productId && existingSizesKey === sizesKey;
        });

        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeItem(productId, sizes);
            } else {
                save();
            }
        }
    };

    const removeItem = (productId: number, sizes?: string[] | null) => {
        const sizesKey = (sizes || []).sort().join('|');
        const index = items.value.findIndex(i => {
            const existingSizesKey = (i.sizes || []).sort().join('|');
            return i.id === productId && existingSizesKey === sizesKey;
        });

        if (index > -1) {
            items.value.splice(index, 1);
            save();
        }
    };

    const clear = () => {
        items.value = [];
        save();
    };

    const clearGuest = () => {
        items.value = [];
        localStorage.removeItem('cart');
    };

    const removeOwnedProducts = async (userId: number) => {
        if (userId == null) return;

        let remaining = items.value.filter(item => {
            const seller = item.seller_id ?? null;
            return seller !== userId;
        });

        const missing = remaining.filter(i => i.seller_id == null);
        if (missing.length > 0) {
            try {
                const response = await api.get('/products');
                const products = response.data;
                const map = new Map<number, any>();
                products.forEach((p: any) => map.set(p.id, p));

                remaining = remaining.filter(item => {
                    const seller = item.seller_id ?? null;
                    if (seller != null) return seller !== userId;
                    const prod = map.get(item.id);
                    if (!prod) return true;
                    return prod.seller_id !== userId;
                });
            } catch (err) {
                console.error('removeOwnedProducts: ürün bilgisi alınamadı', err);
            }
        }

        items.value = remaining;
        save();
    };

    // Initialize on store creation
    init();

    return {
        items,
        totalPrice,
        totalItems,
        isEmpty,
        init,
        addItem,
        updateQuantity,
        removeItem,
        clear,
        clearGuest,
        removeOwnedProducts
    };
});

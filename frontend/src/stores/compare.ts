import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface CompareProduct {
    id: number;
    title: string;
    price: number;
    image_url: string;
    category_name: string;
    features?: any;
    description?: string;
}

export const useCompareStore = defineStore('compare', () => {
    // Constants
    const MAX_ITEMS = 3;

    // State
    const items = ref<CompareProduct[]>([]);

    // Getters
    const count = computed(() => items.value.length);
    const isFull = computed(() => items.value.length >= MAX_ITEMS);
    const isEmpty = computed(() => items.value.length === 0);

    // Actions
    const init = () => {
        const stored = localStorage.getItem('compareList');
        if (stored) {
            items.value = JSON.parse(stored);
        }
    };

    const save = () => {
        localStorage.setItem('compareList', JSON.stringify(items.value));
    };

    const isInCompare = (productId: number): boolean => {
        return items.value.some(p => p.id === productId);
    };

    const add = (product: CompareProduct): boolean => {
        if (items.value.length >= MAX_ITEMS) {
            return false;
        }

        const exists = items.value.find(p => p.id === product.id);
        if (exists) {
            return false;
        }

        items.value.push(product);
        save();
        return true;
    };

    const remove = (productId: number) => {
        items.value = items.value.filter(p => p.id !== productId);
        save();
    };

    const clear = () => {
        items.value = [];
        localStorage.removeItem('compareList');
    };

    // Initialize on store creation
    init();

    return {
        items,
        count,
        isFull,
        isEmpty,
        MAX_ITEMS,
        isInCompare,
        add,
        remove,
        clear
    };
});

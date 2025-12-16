import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../lib/axios';

interface Order {
    id: number;
    product_id: number;
    product_title: string;
    product_image: string;
    quantity: number;
    total_price: number;
    status: string;
    buyer_id: number;
    buyer_name: string;
    seller_id: number;
    seller_name: string;
    sizes?: string[];
    created_at: string;
}

export const useOrderStore = defineStore('orders', () => {
    // State
    const orders = ref<Order[]>([]);
    const soldOrders = ref<Order[]>([]);
    const purchasedOrders = ref<Order[]>([]);
    const loading = ref(false);

    // Actions
    const fetchMyOrders = async (userId: number) => {
        loading.value = true;
        try {
            const response = await api.get('/orders/my-orders');
            orders.value = response.data;
            soldOrders.value = response.data.filter((order: Order) => order.seller_id === userId);
            purchasedOrders.value = response.data.filter((order: Order) => order.buyer_id === userId);
            return response.data;
        } catch (error) {
            console.error('Siparişler yüklenirken hata:', error);
            return [];
        } finally {
            loading.value = false;
        }
    };

    const createOrder = async (data: { product_id: number; quantity: number; sizes?: string[] }) => {
        loading.value = true;
        try {
            const response = await api.post('/orders', data);
            if (response.data.error) {
                return { error: response.data.error };
            }
            return { success: true, data: response.data };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Sipariş oluşturulurken hata.';
            return { error: message };
        } finally {
            loading.value = false;
        }
    };

    const updateOrderStatus = async (orderId: number, status: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status });

            // Update local state
            const orderIndex = orders.value.findIndex(o => o.id === orderId);
            if (orderIndex > -1 && orders.value[orderIndex]) {
                orders.value[orderIndex].status = status;
            }

            const soldIndex = soldOrders.value.findIndex(o => o.id === orderId);
            if (soldIndex > -1 && soldOrders.value[soldIndex]) {
                soldOrders.value[soldIndex].status = status;
            }

            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Durum güncellenirken hata.';
            return { error: message };
        }
    };

    return {
        orders,
        soldOrders,
        purchasedOrders,
        loading,
        fetchMyOrders,
        createOrder,
        updateOrderStatus
    };
});

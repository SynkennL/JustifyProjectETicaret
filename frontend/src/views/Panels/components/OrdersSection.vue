<script setup lang="ts">
import Card from "../../../components/common/Card.vue";
import EmptyState from "../../../components/common/EmptyState.vue";
import OrderCard from "../../../components/order/OrderCard.vue";

defineProps<{
  soldOrders: any[];
  purchasedOrders: any[];
}>();

const emit = defineEmits<{
  (e: 'updateOrderStatus', orderId: number, newStatus: string): void;
}>();
</script>

<template>
  <!-- Sattığım Ürünlerin Siparişleri -->
  <Card title="Sattığım Ürünlerin Siparişleri" padding="md" class="mb-8 bg-blue-50">
    <p class="text-sm text-gray-600 mb-4">Sizin ilanlarınızdan satın alınan ürünler ({{ soldOrders.length }} sipariş)</p>
    
    <EmptyState 
      v-if="soldOrders.length === 0"
      title="Henüz ürünlerinizden sipariş verilmedi"
      icon="cart"
    />

    <div v-else class="space-y-4">
      <OrderCard 
        v-for="order in soldOrders" 
        :key="order.id" 
        :order="order" 
        type="sold"
        :on-status-change="(orderId: number, status: string) => emit('updateOrderStatus', orderId, status)"
      />
    </div>
  </Card>

  <!-- Satın Aldığım Siparişler -->
  <Card title="Satın Aldığım Siparişler" padding="md" class="bg-purple-50">
    <p class="text-sm text-gray-600 mb-4">Başka satıcılardan satın aldığınız ürünler ({{ purchasedOrders.length }} sipariş)</p>
    
    <EmptyState 
      v-if="purchasedOrders.length === 0"
      title="Henüz ürün satın almadınız"
      icon="cart"
    />

    <div v-else class="space-y-4">
      <OrderCard 
        v-for="order in purchasedOrders" 
        :key="order.id" 
        :order="order" 
        type="purchased"
      />
    </div>
  </Card>
</template>

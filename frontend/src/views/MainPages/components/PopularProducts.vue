<script setup lang="ts">
import ProductCard from "../../../components/product/ProductCard.vue";
import EmptyState from "../../../components/common/EmptyState.vue";

defineProps<{
  products: any[];
  selectedSizes: Record<number, string>;
  currentUserId: number | null;
}>();

const emit = defineEmits<{
  (e: 'update:selectedSize', productId: number, size: string): void;
  (e: 'refresh'): void;
}>();

function isOwnProduct(product: any, userId: number | null): boolean {
  if (!userId || !product?.seller_id) return false;
  return product.seller_id === userId;
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Popüler Ürünler</h2>
        <p class="text-gray-600">En çok satın alınan ürünlerimiz</p>
      </div>

      <EmptyState 
        v-if="products.length === 0"
        title="Henüz popüler ürün bulunmuyor"
        icon="product"
      />

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :selected-size="selectedSizes[product.id]"
          @update:selected-size="emit('update:selectedSize', product.id, $event)"
          :is-owned="isOwnProduct(product, currentUserId)"
          @refresh="emit('refresh')"
        />
      </div>
    </div>
  </div>
</template>

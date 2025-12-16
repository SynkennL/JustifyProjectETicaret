<script setup lang="ts">
import ProductCard from "../../../components/product/ProductCard.vue";
import EmptyState from "../../../components/common/EmptyState.vue";
import LoadingSpinner from "../../../components/common/LoadingSpinner.vue";
import Button from "../../../components/common/Button.vue";

defineProps<{
  products: any[];
  selectedSizes: Record<number, string>;
  currentUserId: number | null;
  selectedCategory: string;
  categories: { name: string; slug: string }[];
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'selectCategory', slug: string): void;
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
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Keşfedilebilir Ürünler</h2>
        <p class="text-gray-600">İlgini çeken kategorideki ürünleri keşfet</p>
      </div>

      <div class="flex flex-wrap gap-3 mb-8">
        <Button 
          v-for="category in categories" 
          :key="category.slug"
          variant="primary"
          @click="emit('selectCategory', category.slug)"
        >
          {{ category.name }}
        </Button>
      </div>

      <LoadingSpinner v-if="isLoading" text="Ürünler yükleniyor..." />

      <EmptyState 
        v-else-if="products.length === 0"
        title="Bu kategoride henüz ürün bulunmuyor"
        icon="product"
      />

      <div v-else>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
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

        <div class="text-center mt-8">
          <RouterLink :to="`/kategori/${selectedCategory}`">
            <Button variant="primary" size="lg">
              Tümünü Gör
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { useProductStore, useFavoritesStore, useAuthStore } from "../../stores";
import ProductCard from "../../components/product/ProductCard.vue";
import EmptyState from "../../components/common/EmptyState.vue";
import PageHeader from "../../components/layout/PageHeader.vue";

const route = useRoute();
const productStore = useProductStore();
const favoritesStore = useFavoritesStore();
const authStore = useAuthStore();

const categorySlug = ref(String(route.params.name));
const selectedSizes = reactive<Record<number, string>>({});

const categoryTitles: Record<string, string> = {
  "erkek-giyim": "Erkek Giyim",
  "kadin-giyim": "Kadın Giyim",
  "ayakkabi": "Ayakkabı",
  "cocuk-giyim": "Çocuk Giyim",
};

const products = computed(() => {
  return productStore.products.filter(p => p.seller_id !== authStore.userId);
});

watch(
  () => route.params.name,
  (newVal) => {
    categorySlug.value = String(newVal);
    loadProducts();
  }
);

onMounted(() => {
  loadProducts();
  favoritesStore.loadIds();
});

async function loadProducts() {
  if (!categorySlug.value) return;
  await productStore.fetchProducts(categorySlug.value);
}

function isOwnProduct(product: any): boolean {
  if (!authStore.userId || !product?.seller_id) return false;
  return product.seller_id === authStore.userId;
}
</script>

<template>
  <div class="min-h-screen p-6">
    <PageHeader 
      :title="categoryTitles[categorySlug] || 'Kategori'" 
      show-back
    />

    <EmptyState
      v-if="products.length === 0"
      title="Bu kategoride henüz ürün bulunmuyor"
      icon="product"
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :selected-size="selectedSizes[product.id]"
        @update:selected-size="selectedSizes[product.id] = $event"
        :is-owned="isOwnProduct(product)"
        @refresh="loadProducts"
      />
    </div>
  </div>
</template>
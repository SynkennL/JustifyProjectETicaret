<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCompareStore, useCartStore } from "../../stores";
import { toast } from "vue3-toastify";
import Button from "../../components/common/Button.vue";
import EmptyState from "../../components/common/EmptyState.vue";
import PageHeader from "../../components/layout/PageHeader.vue";
import CompareTable from "./components/CompareTable.vue";

const router = useRouter();
const compareStore = useCompareStore();
const cartStore = useCartStore();

const getFirstImage = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return 'https://via.placeholder.com/300';
  try {
    const parsed = JSON.parse(imageUrl);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imageUrl;
  } catch {
    return imageUrl;
  }
};

const parseFeatures = (features: any) => {
  if (!features) return null;
  return typeof features === 'string' ? JSON.parse(features) : features;
};

const allFeatureKeys = computed(() => {
  const keys = new Set<string>();
  compareStore.items.forEach(product => {
    const features = parseFeatures(product.features);
    if (features) {
      Object.keys(features).forEach(key => {
        if (key.toLowerCase() !== 'sizes') keys.add(key);
      });
    }
  });
  return Array.from(keys);
});

const handleAddToCart = (product: any) => {
  cartStore.addItem({
    id: product.id,
    title: product.title,
    price: product.price,
    image: getFirstImage(product.image_url),
    seller_id: product.seller_id,
  });
  toast.success(`"${product.title}" sepete eklendi!`);
};

const handleRemove = (productId: number) => {
  compareStore.remove(productId);
  toast.success("Ürün karşılaştırmadan kaldırıldı!");
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Ürün Karşılaştırma" 
        description="Ürünleri yan yana karşılaştırın ve en iyisini seçin"
      >
        <template #actions>
          <div class="flex items-center gap-3 justify-end mt-4">
            <Button 
              v-if="compareStore.count > 0"
              variant="danger"
              @click="compareStore.clear()"
            >
              Tümünü Temizle
            </Button>
            <Button @click="router.push('/')">
              Alışverişe Dön
            </Button>
          </div>
        </template>
      </PageHeader>

      <EmptyState
        v-if="compareStore.isEmpty"
        title="Karşılaştırma listesi boş"
        description="Ürün sayfalarından karşılaştırma ikonuna tıklayarak ürün ekleyin"
        icon="compare"
        action-text="Ürünleri Keşfet"
        action-to="/"
      />

      <CompareTable
        v-else
        :products="compareStore.items"
        :all-feature-keys="allFeatureKeys"
        @remove="handleRemove"
        @add-to-cart="handleAddToCart"
      />

      <div v-if="compareStore.count > 0" class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-sm text-blue-800">
            <strong>İpucu:</strong> En fazla {{ compareStore.MAX_ITEMS }} ürün karşılaştırabilirsiniz. Daha fazla ürün eklemek için mevcut ürünlerden birini kaldırın.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
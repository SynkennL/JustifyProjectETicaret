<script setup lang="ts">
import Button from "../../../components/common/Button.vue";
import Card from "../../../components/common/Card.vue";
import EmptyState from "../../../components/common/EmptyState.vue";

defineProps<{
  products: any[];
}>();

const emit = defineEmits<{
  (e: 'deleteProduct', productId: number): void;
  (e: 'editProduct', product: any): void;
}>();

function getFirstImage(imageUrl: string | null | undefined): string {
  if (!imageUrl) return 'https://via.placeholder.com/300';
  try {
    const parsed = JSON.parse(imageUrl);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imageUrl;
  } catch {
    return imageUrl;
  }
}

function parseFeatures(features: any) {
  if (!features) return null;
  return typeof features === 'string' ? JSON.parse(features) : features;
}

function featureEntries(features: any) {
  const f = parseFeatures(features);
  if (!f) return [];
  const hasSizes = Array.isArray(f.sizes) && f.sizes.length > 0;
  return Object.entries(f).filter(([k]) => {
    const lk = String(k).toLowerCase();
    return lk !== 'sizes' && !(hasSizes && ['beden', 'bede', 'size'].includes(lk));
  });
}
</script>

<template>
  <Card title="Benim İlanlarım" :padding="products.length ? 'md' : 'lg'" class="mb-8">
    <p class="text-sm text-gray-600 mb-4">Toplam {{ products.length }} ilan</p>
    
    <EmptyState 
      v-if="products.length === 0"
      title="Henüz ilan eklemediniz"
      description="Yukarıdan yeni ilan ekleyebilirsiniz"
      icon="product"
    />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card v-for="product in products" :key="product.id" padding="md" hover>
        <RouterLink :to="`/urun/${product.id}`">
          <img :src="getFirstImage(product.image_url)" alt="Ürün" class="w-full h-48 object-cover rounded-lg mb-3 hover:opacity-90 transition" />
        </RouterLink>
        <RouterLink :to="`/urun/${product.id}`">
          <h4 class="font-semibold text-lg mb-1 hover:text-blue-600 transition">{{ product.title }}</h4>
        </RouterLink>
        <p class="text-gray-600 text-sm mb-2 line-clamp-2">{{ product.description }}</p>
        <p class="text-gray-500 text-xs mb-2">Kategori: {{ product.category_name }}</p>
        
        <div v-if="featureEntries(product.features).length" class="mb-3">
          <div class="flex flex-wrap gap-2">
            <span v-for="[key, value] in featureEntries(product.features)" :key="key" class="text-xs font-medium px-3 py-1.5 rounded-full border text-black">
              {{ key }}: {{ value }}
            </span>
          </div>
        </div>
        
        <!-- Price with discount support -->
        <div class="mb-3">
          <template v-if="product.discount_price">
            <span class="text-sm text-gray-400 line-through mr-2">{{ product.price }} TL</span>
            <span class="font-bold text-lg text-red-600">{{ product.discount_price }} TL</span>
          </template>
          <p v-else class="font-bold text-lg text-gray-900">{{ product.price }} TL</p>
        </div>
        
        <div class="flex gap-2">
          <Button variant="outline" flex @click="emit('editProduct', product)">Düzenle</Button>
          <Button variant="danger" flex @click="emit('deleteProduct', product.id)">Sil</Button>
        </div>
      </Card>
    </div>
  </Card>
</template>


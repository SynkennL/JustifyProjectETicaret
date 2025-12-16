<script setup lang="ts">
import Button from "../../../components/common/Button.vue";
import Card from "../../../components/common/Card.vue";
import EmptyState from "../../../components/common/EmptyState.vue";

defineProps<{
  products: any[];
}>();

const emit = defineEmits<{
  (e: 'deleteProduct', productId: number): void;
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
</script>

<template>
  <Card title="🏪 Tüm Kullanıcı Ürünleri" padding="md">
    <p class="text-sm text-gray-600 mb-4">Toplam {{ products.length }} ürün</p>
    
    <EmptyState 
      v-if="products.length === 0"
      title="Henüz ürün bulunmuyor"
      icon="product"
    />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card v-for="product in products" :key="product.id" padding="md" hover>
        <img 
          :src="getFirstImage(product.image_url)" 
          alt="Ürün" 
          class="w-full h-48 object-cover rounded-lg mb-3"
        />
        <h4 class="font-semibold text-lg mb-1">{{ product.title }}</h4>
        <p class="text-gray-600 text-sm mb-2 line-clamp-2">{{ product.description }}</p>
        <p class="text-gray-500 text-xs mb-1">Kategori: {{ product.category_name }}</p>
        <p class="text-gray-500 text-xs mb-2">
          Satıcı: {{ product.seller_name || product.seller_email }}
        </p>
        <p class="font-bold text-lg mb-3">{{ product.price }} TL</p>
        <Button variant="danger" full-width @click="emit('deleteProduct', product.id)">
          Sil
        </Button>
      </Card>
    </div>
  </Card>
</template>

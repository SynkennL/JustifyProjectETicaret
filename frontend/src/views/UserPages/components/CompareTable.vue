<script setup lang="ts">
import Button from "../../../components/common/Button.vue";

defineProps<{
  products: any[];
  allFeatureKeys: string[];
}>();

const emit = defineEmits<{
  (e: 'remove', productId: number): void;
  (e: 'addToCart', product: any): void;
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

function getFeatureValue(product: any, key: string) {
  const features = parseFeatures(product.features);
  return features?.[key] || '-';
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="text-left p-4 font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10">Özellikler</th>
            <th v-for="product in products" :key="product.id" class="p-4 min-w-[280px]">
              <div class="relative">
                <button 
                  @click="emit('remove', product.id)"
                  class="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition shadow-lg"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img 
                  :src="getFirstImage(product.image_url)" 
                  :alt="product.title"
                  class="w-full h-48 object-cover rounded-lg mb-3"
                />
                <RouterLink 
                  :to="`/urun/${product.id}`"
                  class="font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 block mb-2"
                >
                  {{ product.title }}
                </RouterLink>
                <div class="text-2xl font-bold text-gray-900 mb-2">{{ product.price }} TL</div>
                <div class="text-sm text-gray-600 mb-3">{{ product.category_name }}</div>
                <Button full-width @click="emit('addToCart', product)">
                  Sepete Ekle
                </Button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-gray-200 hover:bg-gray-50">
            <td class="p-4 font-medium text-gray-900 sticky left-0 bg-white">Açıklama</td>
            <td v-for="product in products" :key="product.id" class="p-4 text-sm text-gray-600">
              {{ product.description || '-' }}
            </td>
          </tr>

          <tr 
            v-for="featureKey in allFeatureKeys" 
            :key="featureKey"
            class="border-b border-gray-200 hover:bg-gray-50"
          >
            <td class="p-4 font-medium text-gray-900 sticky left-0 bg-white">{{ featureKey }}</td>
            <td v-for="product in products" :key="product.id" class="p-4 text-sm text-gray-600">
              {{ getFeatureValue(product, featureKey) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

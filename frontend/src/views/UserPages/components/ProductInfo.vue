<script setup lang="ts">
import Button from "../../../components/common/Button.vue";
import Card from "../../../components/common/Card.vue";

defineProps<{
  product: any;
  features: any;
  displayFeatures: [string, any][];
  selectedSize: string;
  quantity: number;
  isOwnProduct: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:selectedSize', value: string): void;
  (e: 'update:quantity', value: number): void;
  (e: 'addToCart'): void;
  (e: 'buyNow'): void;
}>();
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-2">{{ product.title }}</h1>
    <p class="text-gray-600 text-sm mb-3">{{ product.description }}</p>
    <div class="text-3xl font-bold text-gray-900 mb-4">{{ product.price }} TL</div>
    <div class="text-sm text-gray-600 mb-4">
      Satıcı: <span class="font-medium text-gray-900">{{ product.seller_name || product.seller_email }}</span>
    </div>

    <Card v-if="displayFeatures.length" padding="md" class="mb-4">
      <div class="text-sm font-semibold mb-2">Özellikler</div>
      <div class="text-sm space-y-1">
        <div v-for="[key, value] in displayFeatures" :key="key" class="flex">
          <span class="text-gray-600 w-24">{{ key }}:</span>
          <span class="font-medium">{{ value }}</span>
        </div>
      </div>
    </Card>

    <div v-if="features?.sizes" class="mb-4">
      <div class="text-sm font-semibold mb-2">Beden</div>
      <div class="flex flex-wrap gap-2">
        <label v-for="size in features.sizes" :key="size" class="flex items-center gap-1 cursor-pointer">
          <input 
            type="radio" 
            :value="size" 
            :checked="selectedSize === size"
            @change="emit('update:selectedSize', size)" 
            name="sizeGroup" 
            class="w-3 h-3" 
          />
          {{ size }}
        </label>
      </div>
    </div>

    <div class="mb-4">
      <div class="text-sm font-semibold mb-2">Miktar</div>
      <div class="flex items-center gap-2">
        <Button size="sm" @click="emit('update:quantity', Math.max(1, quantity - 1))">-</Button>
        <span class="w-12 text-center">{{ quantity }}</span>
        <Button size="sm" @click="emit('update:quantity', quantity + 1)">+</Button>
      </div>
    </div>

    <div v-if="isOwnProduct" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
      Kendi ürününüzü satın alamazsınız
    </div>

    <div class="flex gap-2">
      <Button flex @click="emit('addToCart')" :disabled="isOwnProduct">
        Sepete Ekle
      </Button>
      <Button flex variant="success" @click="emit('buyNow')" :disabled="isOwnProduct">
        Satın Al
      </Button>
    </div>

    <div class="mt-4 pt-3">
      <RouterLink :to="`/kategori/${product.category_slug}`" class="text-sm text-gray-600 hover:text-gray-900 transition">
        Kategori: {{ product.category_name }}
      </RouterLink>
    </div>
  </div>
</template>

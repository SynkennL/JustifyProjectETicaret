<script setup lang="ts">
import Button from "../../../components/common/Button.vue";
import Card from "../../../components/common/Card.vue";

defineProps<{
  item: any;
}>();

const emit = defineEmits<{
  (e: 'updateQuantity', productId: number, delta: number, sizes?: string[] | null): void;
  (e: 'remove', productId: number, sizes?: string[] | null): void;
  (e: 'buy', product: any): void;
}>();

function getFirstImage(imageUrl: string | null | undefined): string {
  if (!imageUrl) return 'https://via.placeholder.com/300';
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0];
    }
  } catch {
    return imageUrl;
  }
  return imageUrl;
}
</script>

<template>
  <Card padding="md">
    <div class="flex gap-4">
      <img 
        :src="getFirstImage(item.image)" 
        :alt="item.title"
        class="w-24 h-24 object-cover rounded"
      />
      
      <div class="flex-1">
        <h3 class="font-semibold text-lg text-slate-900 mb-1">{{ item.title }}</h3>
        <p class="text-slate-900 font-bold text-xl mb-3">{{ item.price }} TL</p>

        <p v-if="item.sizes && item.sizes.length" class="text-sm text-gray-600 mb-2">
          Seçilen Bedenler: <span class="font-semibold">{{ item.sizes.join(", ") }}</span>
        </p>
        
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              @click="emit('updateQuantity', item.id, -1, item.sizes)"
            >
              -
            </Button>
            <span class="w-12 text-center font-medium">{{ item.quantity }}</span>
            <Button 
              variant="outline"
              size="sm"
              @click="emit('updateQuantity', item.id, 1, item.sizes)"
            >
              +
            </Button>
          </div>
          
          <Button 
            variant="primary"
            size="sm"
            @click="emit('buy', item)"
          >
            Satın Al
          </Button>
          
          <Button 
            variant="danger"
            size="sm"
            @click="emit('remove', item.id, item.sizes)"
          >
            Kaldır
          </Button>
        </div>
        
        <p class="text-sm text-gray-600 mt-3">
          Ara Toplam: <span class="font-semibold">{{ (item.price * item.quantity).toFixed(2) }} TL</span>
        </p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Button from "../../../components/common/Button.vue";
import Card from "../../../components/common/Card.vue";

defineProps<{
  totalItems: number;
  totalPrice: number;
  cartLength: number;
}>();

const emit = defineEmits<{
  (e: 'buyAll'): void;
  (e: 'continueShopping'): void;
}>();
</script>

<template>
  <Card padding="lg">
    <div class="space-y-2 mb-4">
      <div class="flex justify-between text-gray-700">
        <span>Toplam Ürün:</span>
        <span class="font-semibold">{{ totalItems }} adet</span>
      </div>
      <div class="flex justify-between text-slate-900 text-2xl font-bold pt-2 border-t border-gray-300">
        <span>Toplam:</span>
        <span>{{ totalPrice.toFixed(2) }} TL</span>
      </div>
    </div>

    <div class="flex gap-3">
      <Button 
        variant="primary"
        size="lg"
        @click="emit('buyAll')"
      >
        Tümünü Satın Al ({{ cartLength }} Ürün)
      </Button>

      <Button
        variant="secondary"
        size="lg"
        @click="emit('continueShopping')"
      >
        Alışverişe Devam Et
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useCartStore, useOrderStore } from "../../stores";
import { toast } from "vue3-toastify";
import Button from "../../components/common/Button.vue";
import EmptyState from "../../components/common/EmptyState.vue";
import PageHeader from "../../components/layout/PageHeader.vue";
import CartItem from "./components/CartItem.vue";
import CartSummary from "./components/CartSummary.vue";

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();

const buyProduct = async (product: any) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.info("Satın almak için giriş yapmalısınız!");
    router.push("/login");
    return;
  }

  const result = await orderStore.createOrder({
    product_id: product.id,
    quantity: product.quantity,
    sizes: product.sizes && product.sizes.length > 0 ? product.sizes : undefined
  });

  if (result.error) {
    toast.error(result.error);
    return;
  }

  toast.success(`"${product.title}" başarıyla satın alındı!`);
  cartStore.removeItem(product.id, product.sizes);
};

const buyAll = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.info("Satın almak için giriş yapmalısınız!");
    router.push("/login");
    return;
  }

  if (cartStore.isEmpty) {
    toast.info("Sepetiniz boş!");
    return;
  }

  if (!confirm(`"${cartStore.items.length}" ürünü toplam ${cartStore.totalPrice} TL'ye satın almak istediğinize emin misiniz?`)) {
    return;
  }

  let successCount = 0;
  let errorMessages: string[] = [];
  const itemsToRemove: any[] = [];

  for (const item of cartStore.items) {
    const result = await orderStore.createOrder({
      product_id: item.id,
      quantity: item.quantity,
      sizes: item.sizes && item.sizes.length > 0 ? item.sizes : undefined
    });

    if (result.error) {
      errorMessages.push(`${item.title}: ${result.error}`);
    } else {
      successCount++;
      itemsToRemove.push(item);
    }
  }

  for (const item of itemsToRemove) {
    cartStore.removeItem(item.id, item.sizes);
  }

  if (errorMessages.length > 0) {
    toast.error("Bazı ürünler satın alınamadı:\n" + errorMessages.join("\n"));
  }

  if (successCount > 0) {
    toast.success(`${successCount} ürün başarıyla satın alındı!`);
  }
};
</script>

<template>
  <div class="min-h-screen max-w-4xl mx-auto p-4">
    <PageHeader title="Alışveriş Sepetim">
      <template #actions>
        <div class="flex justify-end mt-4">
          <Button 
            v-if="!cartStore.isEmpty"
            variant="danger"
            @click="cartStore.clear()"
          >
            Sepeti Temizle
          </Button>
        </div>
      </template>
    </PageHeader>

    <EmptyState
      v-if="cartStore.isEmpty"
      title="Sepetiniz boş"
      description="Alışverişe başlamak için ürünleri keşfedin"
      icon="cart"
      action-text="Alışverişe Başla"
      action-to="/"
    />

    <div v-else class="space-y-4">
      <!-- Ürün Listesi -->
      <CartItem
        v-for="item in cartStore.items"
        :key="item.id + '-' + (item.sizes || []).join('|')"
        :item="item"
        @update-quantity="cartStore.updateQuantity"
        @remove="cartStore.removeItem"
        @buy="buyProduct"
      />

      <!-- Sepet Özeti -->
      <CartSummary
        :total-items="cartStore.totalItems"
        :total-price="cartStore.totalPrice"
        :cart-length="cartStore.items.length"
        @buy-all="buyAll"
        @continue-shopping="router.push('/')"
      />
    </div>
  </div>
</template>
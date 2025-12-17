<script setup lang="ts">
import { ref, onMounted, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "../../composables/useToast";
import { useFavoritesStore, useAuthStore } from "../../stores";
import ProductCard from "../../components/product/ProductCard.vue";
import EmptyState from "../../components/common/EmptyState.vue";
import LoadingSpinner from "../../components/common/LoadingSpinner.vue";
import PageHeader from "../../components/layout/PageHeader.vue";
import Button from "../../components/common/Button.vue";

const router = useRouter();
const favoritesStore = useFavoritesStore();
const authStore = useAuthStore();
const toast = useToast();

const selectedSizes = reactive<Record<number, string>>({});

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.info("Favorileri görmek için giriş yapmalısınız!");
    router.push("/login");
    return;
  }

  await favoritesStore.fetchFavorites();
});

function isOwnProduct(product: any): boolean {
  if (!authStore.userId || !product?.seller_id) return false;
  return product.seller_id === authStore.userId;
}
</script>

<template>
  <div class="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <PageHeader 
      title="Favorilerim" 
      description="Beğendiğiniz ürünleri buradan takip edebilirsiniz"
    >
      <template #actions>
        <div class="flex justify-end mt-4">
          <Button @click="router.push('/')">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Alışverişe Devam
          </Button>
        </div>
      </template>
    </PageHeader>

    <LoadingSpinner v-if="favoritesStore.loading" />

    <EmptyState
      v-else-if="favoritesStore.favorites.length === 0"
      title="Henüz favori ürününüz yok"
      description="Beğendiğiniz ürünleri favorilere ekleyerek kolayca takip edebilirsiniz"
      icon="favorite"
      action-text="Ürünleri Keşfet"
      action-to="/"
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in favoritesStore.favorites"
        :key="product.id"
        :product="product"
        :selected-size="selectedSizes[product.id]"
        @update:selected-size="selectedSizes[product.id] = $event"
        :is-owned="isOwnProduct(product)"
        @refresh="favoritesStore.fetchFavorites()"
      />
    </div>
  </div>
</template>
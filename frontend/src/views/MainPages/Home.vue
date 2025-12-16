<script setup lang="ts">
import { ref, onMounted, reactive, computed } from "vue";
import { useProductStore, useFavoritesStore, useAuthStore } from "../../stores";
import HeroSlider from "./components/HeroSlider.vue";
import PopularProducts from "./components/PopularProducts.vue";
import DiscoverableProducts from "./components/DiscoverableProducts.vue";
import PopularCategories from "./components/PopularCategories.vue";

// Resimleri import edelim
import erkekGiyimImg from "../../assets/banners/erkek-giyim.jpeg";
import kadinGiyimImg from "../../assets/banners/kadın-giyim.jpg";
import ayakkabiImg from "../../assets/banners/ayakkabi.jpg";
import cocukGiyimImg from "../../assets/banners/cocuk-giyim.jpg";

const productStore = useProductStore();
const favoritesStore = useFavoritesStore();
const authStore = useAuthStore();

const selectedCategory = ref<string>("erkek-giyim");
const selectedSizes = reactive<Record<number, string>>({});

const categories = [
  { name: "Erkek Giyim", slug: "erkek-giyim" },
  { name: "Kadın Giyim", slug: "kadin-giyim" },
  { name: "Ayakkabı", slug: "ayakkabi" },
  { name: "Çocuk Giyim", slug: "cocuk-giyim" }
];

const categoryImages: Record<string, string> = {
  "erkek-giyim": erkekGiyimImg,
  "kadin-giyim": kadinGiyimImg,
  "ayakkabi": ayakkabiImg,
  "cocuk-giyim": cocukGiyimImg
};

const popularProducts = computed(() => {
  return productStore.popularProducts.filter(p => p.seller_id !== authStore.userId);
});

const categoryProducts = computed(() => {
  return productStore.categoryProducts.filter(p => p.seller_id !== authStore.userId);
});

onMounted(async () => {
  await Promise.all([
    productStore.fetchPopularProducts(),
    productStore.fetchCategoryProducts(selectedCategory.value, 4),
    favoritesStore.loadIds()
  ]);
});

async function selectCategory(categorySlug: string) {
  selectedCategory.value = categorySlug;
  await productStore.fetchCategoryProducts(categorySlug, 4);
}

function handleSizeUpdate(productId: number, size: string) {
  selectedSizes[productId] = size;
}

const handleRefresh = () => {
  productStore.fetchPopularProducts();
};
</script>

<template>
  <!-- Hero Slider -->
  <HeroSlider />

  <!-- Popüler Ürünler -->
  <PopularProducts
    :products="popularProducts"
    :selected-sizes="selectedSizes"
    :current-user-id="authStore.userId"
    @update:selected-size="handleSizeUpdate"
    @refresh="handleRefresh"
  />

  <!-- Keşfedilebilir Ürünler -->
  <DiscoverableProducts
    :products="categoryProducts"
    :selected-sizes="selectedSizes"
    :current-user-id="authStore.userId"
    :selected-category="selectedCategory"
    :categories="categories"
    :is-loading="productStore.categoryLoading"
    @select-category="selectCategory"
    @update:selected-size="handleSizeUpdate"
    @refresh="productStore.fetchCategoryProducts(selectedCategory, 4)"
  />

  <!-- Popüler Kategoriler -->
  <PopularCategories
    :categories="categories"
    :category-images="categoryImages"
  />
</template>
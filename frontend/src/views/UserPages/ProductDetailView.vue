<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore, useCartStore, useOrderStore, useAuthStore } from "../../stores";
import { toast } from "vue3-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner.vue";
import ProductImageGallery from "./components/ProductImageGallery.vue";
import ProductInfo from "./components/ProductInfo.vue";

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const product = ref<any>(null);
const currentImageIndex = ref(0);
const selectedSize = ref("");
const quantity = ref(1);

const isOwnProduct = computed(() => {
  if (!authStore.userId || !product.value?.seller_id) return false;
  return product.value.seller_id === authStore.userId;
});

const features = computed(() => {
  if (!product.value?.features) return null;
  const f = typeof product.value.features === 'string' 
    ? JSON.parse(product.value.features) 
    : product.value.features;
  return f;
});

const displayFeatures = computed(() => {
  if (!features.value) return [];
  const hasSizes = Array.isArray(features.value.sizes) && features.value.sizes.length > 0;
  return Object.entries(features.value).filter(([k]) => {
    const lk = k.toLowerCase();
    return lk !== 'sizes' && !(hasSizes && ['beden', 'bede', 'size'].includes(lk));
  });
});

onMounted(async () => {
  await loadProduct();
});

async function loadProduct() {
  try {
    const productId = route.params.id;
    const data = await productStore.fetchProduct(productId as string);
    product.value = data;

    if (product.value.image_url) {
      try {
        const parsed = JSON.parse(product.value.image_url);
        product.value.images = Array.isArray(parsed) ? parsed : [product.value.image_url];
      } catch {
        product.value.images = [product.value.image_url];
      }
    } else {
      product.value.images = ['https://via.placeholder.com/600x600?text=No+Image'];
    }
  } catch (error) {
    console.error("Ürün yüklenirken hata:", error);
    toast.error("Ürün bulunamadı!");
    router.push("/");
  }
}

const handleAddToCart = () => {
  if (isOwnProduct.value) {
    toast.error("Kendi ürününüzü sepete ekleyemezsiniz!");
    return;
  }

  if (features.value?.sizes && !selectedSize.value) {
    toast.error("Lütfen bir beden seçiniz!");
    return;
  }

  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem({
      id: product.value.id,
      title: product.value.title,
      price: product.value.price,
      image: product.value.images[0],
      sizes: selectedSize.value ? [selectedSize.value] : null,
      seller_id: product.value.seller_id,
    });
  }

  toast.success(`"${product.value.title}" (${quantity.value} adet) sepete eklendi!`);
};

const handleBuyNow = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.info("Satın almak için giriş yapmalısınız!");
    router.push("/login");
    return;
  }

  if (isOwnProduct.value) {
    toast.error("Kendi ürününüzü satın alamazsınız!");
    return;
  }

  if (features.value?.sizes && !selectedSize.value) {
    toast.error("Lütfen bir beden seçiniz!");
    return;
  }

  const result = await orderStore.createOrder({
    product_id: product.value.id,
    quantity: quantity.value,
    sizes: selectedSize.value ? [selectedSize.value] : undefined
  });

  if (result.error) {
    toast.error(result.error);
    return;
  }

  toast.success(`"${product.value.title}" başarıyla satın alındı!`);
  router.push("/customer-panel");
};

const changeImage = (index: number) => currentImageIndex.value = index;
const nextImage = () => {
  if (product.value.images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value + 1) % product.value.images.length;
  }
};
const prevImage = () => {
  if (product.value.images.length > 1) {
    currentImageIndex.value = currentImageIndex.value === 0
      ? product.value.images.length - 1
      : currentImageIndex.value - 1;
  }
};
</script>

<template>
  <LoadingSpinner v-if="productStore.loading" />

  <div v-else-if="product" class="max-w-6xl mx-auto px-4 py-6">
    <button @click="router.back()" class="text-gray-600 hover:text-gray-900 mb-4 text-sm flex items-center gap-1 transition">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Geri
    </button>

    <div class="grid md:grid-cols-2 gap-6">
      <!-- Resimler -->
      <ProductImageGallery
        :images="product.images"
        :current-index="currentImageIndex"
        :title="product.title"
        @change-image="changeImage"
        @prev-image="prevImage"
        @next-image="nextImage"
      />

      <!-- Bilgiler -->
      <ProductInfo
        :product="product"
        :features="features"
        :display-features="displayFeatures"
        :selected-size="selectedSize"
        :quantity="quantity"
        :is-own-product="isOwnProduct"
        @update:selected-size="selectedSize = $event"
        @update:quantity="quantity = $event"
        @add-to-cart="handleAddToCart"
        @buy-now="handleBuyNow"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useProductStore, useOrderStore, useCategoryStore, useAuthStore } from "../../stores";
import { toast } from "vue3-toastify";
import Button from "../../components/common/Button.vue";
import Card from "../../components/common/Card.vue";
import PageHeader from "../../components/layout/PageHeader.vue";
import ProductForm from "../../components/product/ProductForm.vue";
import MyProductsList from "./components/MyProductsList.vue";
import OrdersSection from "./components/OrdersSection.vue";

const router = useRouter();
const productStore = useProductStore();
const orderStore = useOrderStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();

const myProducts = computed(() => {
  return productStore.products.filter(p => p.seller_id === authStore.userId);
});

onMounted(() => {
  if (!authStore.isLoggedIn) {
    toast.error("Bu sayfaya erişim yetkiniz yok!");
    router.push("/");
    return;
  }
  loadData();
});

async function loadData() {
  await Promise.all([
    productStore.fetchProducts(),
    orderStore.fetchMyOrders(authStore.userId!),
    categoryStore.fetchCategories()
  ]);
}

async function handleProductSubmit(productData: any, sizes: string[]) {
  if (!productData.title || !productData.price || !productData.category_id) {
    toast.error("Başlık, fiyat ve kategori zorunludur!");
    return;
  }

  if (productData.image_urls.length === 0) {
    toast.error("En az bir resim URL'si ekleyin!");
    return;
  }

  const cleanedFeatures: any = {};
  Object.entries(productData.features).forEach(([key, value]) => {
    if (value) cleanedFeatures[key.charAt(0).toUpperCase() + key.slice(1)] = value;
  });

  const data = {
    title: productData.title,
    description: productData.description,
    price: productData.price,
    category_id: productData.category_id,
    images: productData.image_urls,
    features: Object.keys(cleanedFeatures).length > 0 ? cleanedFeatures : null,
    sizes: sizes.length > 0 ? sizes : undefined
  };

  const result = await productStore.createProduct(data);

  if (result.error) {
    toast.error(result.error);
    return;
  }

  toast.success("Ürün başarıyla eklendi!");
  await productStore.fetchProducts();
}

async function deleteProduct(productId: number) {
  if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

  const result = await productStore.deleteProduct(productId);

  if (result.error) {
    toast.error(result.error);
    return;
  }

  toast.success("Ürün başarıyla silindi!");
}

async function updateOrderStatus(orderId: number, newStatus: string) {
  const result = await orderStore.updateOrderStatus(orderId, newStatus);

  if (result.error) {
    toast.error(result.error);
    return;
  }

  toast.success("Sipariş durumu güncellendi!");
}
</script>

<template>
  <div v-if="authStore.isLoggedIn" class="min-h-screen max-w-7xl mx-auto p-6">
    <PageHeader title="Kullanıcı Paneli">
      <template #actions>
        <div class="flex justify-end mt-4">
          <Button v-if="authStore.isAdmin" @click="router.push('/admin')">
           Admin Yönetim Paneli
          </Button>
        </div>
      </template>
    </PageHeader>

    <!-- Yeni İlan Ekle -->
    <Card title="Yeni İlan Ekle" padding="md" class="mb-8 bg-green-50">
      <ProductForm :categories="categoryStore.categories" @submit="handleProductSubmit" />
    </Card>

    <!-- Benim İlanlarım -->
    <MyProductsList
      :products="myProducts"
      @delete-product="deleteProduct"
    />

    <!-- Siparişler -->
    <OrdersSection
      :sold-orders="orderStore.soldOrders"
      :purchased-orders="orderStore.purchasedOrders"
      @update-order-status="updateOrderStatus"
    />
  </div>
</template>
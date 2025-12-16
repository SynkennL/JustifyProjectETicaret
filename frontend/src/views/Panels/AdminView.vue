<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCategoryStore, useProductStore, useAuthStore } from "../../stores";
import { toast } from "vue3-toastify";
import Button from "../../components/common/Button.vue";
import PageHeader from "../../components/layout/PageHeader.vue";
import CategoryManager from "./components/CategoryManager.vue";
import AdminProductList from "./components/AdminProductList.vue";

const router = useRouter();
const categoryStore = useCategoryStore();
const productStore = useProductStore();
const authStore = useAuthStore();

const catName = ref("");
const catSlug = ref("");

async function load() {
  await Promise.all([
    categoryStore.fetchCategories(),
    productStore.fetchProducts()
  ]);
}

async function addCategory() {
  if (!catName.value || !catSlug.value) {
    toast.error("Kategori adı ve slug gereklidir!");
    return;
  }

  const result = await categoryStore.createCategory({ 
    name: catName.value, 
    slug: catSlug.value 
  });

  if (result.error) {
    toast.error(result.error);
    return;
  }
  
  toast.success("Kategori eklendi!");
  catName.value = "";
  catSlug.value = "";
}

async function deleteProduct(productId: number) {
  if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

  const result = await productStore.deleteProduct(productId);
  
  if (result.error) {
    toast.error(result.error);
    return;
  }

  toast.success("Ürün silindi!");
  await productStore.fetchProducts();
}

onMounted(() => {
  if (!authStore.isAdmin) {
    toast.error("Bu sayfaya erişim yetkiniz yok!");
    router.push("/");
    return;
  }
  load();
});
</script>

<template>
  <div class="min-h-screen max-w-7xl mx-auto p-6">
    <PageHeader title="🛠️ Admin Yönetim Paneli">
      <template #actions>
        <div class="flex justify-end mt-4">
          <Button @click="router.push('/customer-panel')">
            ← Kişisel Panelime Dön
          </Button>
        </div>
      </template>
    </PageHeader>

    <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="text-sm text-yellow-800">
          <strong>Not:</strong> Bu sayfa sadece site yönetimi içindir. Kendi ürünlerinizi ve siparişlerinizi yönetmek için "Kişisel Panelime Dön" butonuna tıklayın.
        </div>
      </div>
    </div>

    <!-- Kategori Yönetimi -->
    <CategoryManager
      :categories="categoryStore.categories"
      :cat-name="catName"
      :cat-slug="catSlug"
      @update:cat-name="catName = $event"
      @update:cat-slug="catSlug = $event"
      @add-category="addCategory"
    />

    <!-- Tüm Ürünler -->
    <AdminProductList
      :products="productStore.products"
      @delete-product="deleteProduct"
    />
  </div>
</template>
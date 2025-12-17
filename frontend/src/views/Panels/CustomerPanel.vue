<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useProductStore, useOrderStore, useCategoryStore, useAuthStore } from "../../stores";
import { useToast } from "../../composables/useToast";
import Button from "../../components/common/Button.vue";
import Card from "../../components/common/Card.vue";
import Modal from "../../components/common/Modal.vue";
import Input from "../../components/common/Input.vue";
import PageHeader from "../../components/layout/PageHeader.vue";
import ProductForm from "../../components/product/ProductForm.vue";
import MyProductsList from "./components/MyProductsList.vue";
import OrdersSection from "./components/OrdersSection.vue";


const router = useRouter();
const productStore = useProductStore();
const orderStore = useOrderStore();
const categoryStore = useCategoryStore();
const authStore = useAuthStore();
const toast = useToast();

const myProducts = computed(() => {
  return productStore.products.filter(p => p.seller_id === authStore.userId);
});

// Delete Modal State
const showDeleteModal = ref(false);
const productToDelete = ref<number | null>(null);

// Edit Modal State
const showEditModal = ref(false);
const productToEdit = ref<any>(null);
const editForm = ref({
  title: "",
  description: "",
  price: 0,
  hasDiscount: false,
  discount_price: null as number | null,
  category_id: null as number | null
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

function openDeleteModal(productId: number) {
  productToDelete.value = productId;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!productToDelete.value) return;

  const result = await productStore.deleteProduct(productToDelete.value);
  showDeleteModal.value = false;
  productToDelete.value = null;

  if (result.error) {
    toast.error(result.error);
    return;
  }

  toast.success("Ürün başarıyla silindi!");
}

// Edit Modal Functions
function openEditModal(product: any) {
  productToEdit.value = product;
  editForm.value = {
    title: product.title,
    description: product.description || "",
    price: product.price,
    hasDiscount: !!product.discount_price,
    discount_price: product.discount_price || null,
    category_id: product.category_id
  };
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
  productToEdit.value = null;
}

async function confirmEdit() {
  if (!productToEdit.value) return;

  // Validation
  if (!editForm.value.title || !editForm.value.price) {
    toast.error("Başlık ve fiyat zorunludur!");
    return;
  }

  if (editForm.value.hasDiscount && editForm.value.discount_price) {
    if (editForm.value.discount_price >= editForm.value.price) {
      toast.error("İndirimli fiyat normal fiyattan düşük olmalıdır!");
      return;
    }
  }

  const updateData = {
    title: editForm.value.title,
    description: editForm.value.description,
    price: editForm.value.price,
    discount_price: editForm.value.hasDiscount ? editForm.value.discount_price : null,
    category_id: editForm.value.category_id
  };

  const result = await productStore.updateProduct(productToEdit.value.id, updateData);
  
  if (result.error) {
    toast.error(result.error);
    return;
  }

  toast.success("Ürün başarıyla güncellendi!");
  closeEditModal();
  await productStore.fetchProducts();
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
      @delete-product="openDeleteModal"
      @edit-product="openEditModal"
    />

    <!-- Siparişler -->
    <OrdersSection
      :sold-orders="orderStore.soldOrders"
      :purchased-orders="orderStore.purchasedOrders"
      @update-order-status="updateOrderStatus"
    />

    <!-- Silme Onay Modalı -->
    <Modal
      v-model="showDeleteModal"
      title="Ürünü Sil"
      variant="danger"
      size="sm"
    >
      <p>Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
      <template #footer>
        <Button variant="ghost" @click="showDeleteModal = false">İptal</Button>
        <Button variant="danger" @click="confirmDelete">Evet, Sil</Button>
      </template>
    </Modal>

    <!-- Düzenleme Modalı -->
    <Modal
      v-model="showEditModal"
      title="İlanı Düzenle"
      size="lg"
    >
      <div class="space-y-4">
        <Input 
          v-model="editForm.title" 
          label="Başlık" 
          placeholder="Ürün başlığı"
        />
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
          <textarea 
            v-model="editForm.description" 
            placeholder="Açıklama"
            rows="3"
            class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-slate-900 focus:outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <Input 
            v-model.number="editForm.price" 
            type="number" 
            label="Fiyat (TL)" 
            placeholder="Fiyat"
          />
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select 
              v-model="editForm.category_id" 
              class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-slate-900 focus:outline-none"
            >
              <option :value="null">Kategori seç</option>
              <option v-for="c in categoryStore.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
        </div>

        <!-- İndirimli Fiyat Toggle -->
        <div class="border-t pt-4">
          <div class="flex items-center gap-3 mb-3">
            <button
              type="button"
              @click="editForm.hasDiscount = !editForm.hasDiscount"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                editForm.hasDiscount ? 'bg-red-500' : 'bg-gray-200'
              ]"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  editForm.hasDiscount ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
            <span class="text-sm font-medium text-gray-700">İndirimli</span>
          </div>
          
          <div v-if="editForm.hasDiscount" class="animate-in slide-in-from-top-2">
            <Input 
              v-model.number="editForm.discount_price" 
              type="number" 
              label="İndirimli Fiyat (TL)" 
              placeholder="İndirimli fiyat girin"
            />
            <p class="text-xs text-gray-500 mt-1">
              İndirimli fiyat normal fiyattan ({{ editForm.price }} TL) düşük olmalıdır.
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <Button variant="ghost" @click="closeEditModal">İptal</Button>
        <Button variant="primary" @click="confirmEdit">Kaydet</Button>
      </template>
    </Modal>
  </div>
</template>

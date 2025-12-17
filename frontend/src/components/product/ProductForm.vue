<script setup lang="ts">
import { ref } from 'vue';
import Button from '../common/Button.vue';
import Input from '../common/Input.vue';
import Card from '../common/Card.vue';
import { useAuthStore } from '../../stores';

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category_id: number | null;
  image_urls: string[];
  features: {
    renk: string;
    malzeme: string;
    marka: string;
  };
}

interface Props {
  categories: any[];
  predefinedSizes?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  predefinedSizes: () => ["XS","S","M","L","XL","XXL","36","38","40","42","44"]
});

const emit = defineEmits<{
  submit: [data: ProductFormData, sizes: string[]];
}>();

const authStore = useAuthStore();

const formData = ref<ProductFormData>({
  title: "",
  description: "",
  price: 0,
  category_id: null,
  image_urls: [],
  features: { renk: "", malzeme: "", marka: "" }
});

const newImageUrl = ref("");
const selectedSizes = ref<string[]>([]);
const imageInputMode = ref<'url' | 'file'>('url');
const isUploading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const featureFields = [
  { key: 'renk', label: 'Renk', placeholder: 'Örn: Siyah, Mavi' },
  { key: 'malzeme', label: 'Malzeme', placeholder: 'Örn: %100 Pamuk' },
  { key: 'marka', label: 'Marka', placeholder: 'Örn: Nike, Adidas' }
];

function addImageUrl() {
  if (newImageUrl.value.trim()) {
    formData.value.image_urls.push(newImageUrl.value.trim());
    newImageUrl.value = "";
  }
}

async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];
  
  // Dosya türü kontrolü
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert('Sadece resim dosyaları yüklenebilir (jpeg, png, gif, webp)');
    return;
  }

  // Dosya boyutu kontrolü (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Dosya boyutu 5MB\'dan büyük olamaz');
    return;
  }

  isUploading.value = true;

  try {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    const response = await fetch('http://localhost:4000/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      },
      body: formDataUpload
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Yükleme başarısız');
    }

    const result = await response.json();
    formData.value.image_urls.push(result.url);
  } catch (error: any) {
    alert(error.message || 'Resim yüklenirken hata oluştu');
  } finally {
    isUploading.value = false;
    // Input'u temizle
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }
}

function removeImageUrl(index: number) {
  formData.value.image_urls.splice(index, 1);
}

function resetForm() {
  formData.value = {
    title: "",
    description: "",
    price: 0,
    category_id: null,
    image_urls: [],
    features: { renk: "", malzeme: "", marka: "" }
  };
  selectedSizes.value = [];
  imageInputMode.value = 'url';
}

function handleSubmit() {
  emit('submit', formData.value, selectedSizes.value);
  resetForm();
}

defineExpose({ resetForm });
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input v-model="formData.title" placeholder="Ürün başlığı" />
      <Input v-model.number="formData.price" type="number" placeholder="Fiyat" />
    </div>

    <textarea 
      v-model="formData.description" 
      placeholder="Açıklama" 
      rows="3"
      class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-slate-900 focus:outline-none"
    />

    <select 
      v-model="formData.category_id" 
      class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-slate-900 focus:outline-none"
    >
      <option :value="null">Kategori seç</option>
      <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
    </select>

    <!-- Resim URL'leri -->
    <Card padding="md">
      <h4 class="font-semibold mb-3 text-gray-700">Ürün Resimleri</h4>
      
      <!-- Toggle Butonlar -->
      <div class="flex gap-2 mb-4">
        <button 
          type="button"
          @click="imageInputMode = 'url'"
          :class="[
            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition',
            imageInputMode === 'url' 
              ? 'bg-slate-900 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          URL ile Ekle
        </button>
        <button 
          type="button"
          @click="imageInputMode = 'file'"
          :class="[
            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition',
            imageInputMode === 'file' 
              ? 'bg-slate-900 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          Dosya Yükle
        </button>
      </div>

      <!-- URL Input -->
      <div v-if="imageInputMode === 'url'" class="flex gap-2 mb-3">
        <Input 
          v-model="newImageUrl" 
          placeholder="Resim URL'si ekle (https://...)" 
          @keyup.enter="addImageUrl"
        />
        <Button @click="addImageUrl">Ekle</Button>
      </div>

      <!-- File Input -->
      <div v-else class="mb-3">
        <label 
          class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-slate-900 hover:bg-gray-50 transition"
          :class="{ 'opacity-50 cursor-not-allowed': isUploading }"
        >
          <div class="flex flex-col items-center justify-center pt-2 pb-2">
            <svg v-if="!isUploading" class="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <svg v-else class="w-8 h-8 text-slate-900 animate-spin mb-1" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm text-gray-500">
              {{ isUploading ? 'Yükleniyor...' : 'Resim seçin veya sürükleyin' }}
            </p>
            <p class="text-xs text-gray-400">PNG, JPG, GIF, WEBP (Max 5MB)</p>
          </div>
          <input 
            ref="fileInputRef"
            type="file" 
            class="hidden" 
            accept="image/jpeg,image/png,image/gif,image/webp"
            @change="handleFileSelect"
            :disabled="isUploading"
          />
        </label>
      </div>
      
      <div v-if="formData.image_urls.length > 0" class="grid grid-cols-3 gap-3">
        <div v-for="(url, index) in formData.image_urls" :key="index" class="relative group aspect-square border-2 border-gray-200 rounded-lg overflow-hidden">
          <img :src="url" alt="Ürün resmi" class="w-full h-full object-cover" />
          <button type="button" @click="removeImageUrl(index)" class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <p v-else class="text-sm text-gray-500 text-center py-4">Henüz resim eklenmedi</p>
    </Card>

    <!-- Özellikler -->
    <Card padding="md">
      <h4 class="font-semibold mb-3 text-gray-700">Ürün Özellikleri</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Beden:</label>
          <div class="flex flex-wrap gap-2">
            <label v-for="s in predefinedSizes" :key="s" class="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" :value="s" v-model="selectedSizes" class="w-4 h-4" />
              <span class="text-xs">{{ s }}</span>
            </label>
          </div>
        </div>
        <Input 
          v-for="field in featureFields" 
          :key="field.key"
          v-model="formData.features[field.key as keyof typeof formData.features]" 
          :label="field.label" 
          :placeholder="field.placeholder" 
        />
      </div>
    </Card>

    <Button variant="primary" full-width size="md" @click="handleSubmit">
      Ürün Ekle
    </Button>
  </div>
</template>
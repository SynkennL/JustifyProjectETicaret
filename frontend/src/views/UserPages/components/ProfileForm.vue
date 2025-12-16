<script setup lang="ts">
import { ref } from "vue";
import Button from "../../../components/common/Button.vue";
import Input from "../../../components/common/Input.vue";

defineProps<{
  user: any;
  isEditing: boolean;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'startEditing'): void;
  (e: 'cancelEditing'): void;
  (e: 'saveProfile', form: any): void;
}>();

const editForm = ref({
  name: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
});

function getRoleText(role: string) {
  return role === 'admin' ? 'Yönetici' : 'Müşteri';
}

function initForm(user: any) {
  editForm.value.name = user?.name || "";
  editForm.value.email = user?.email || "";
  editForm.value.currentPassword = "";
  editForm.value.newPassword = "";
  editForm.value.confirmPassword = "";
}

function handleSave() {
  emit('saveProfile', editForm.value);
}

defineExpose({ initForm, editForm });
</script>

<template>
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-xl font-semibold text-slate-900">Hesap Bilgileri</h2>
    <Button v-if="!isEditing" @click="emit('startEditing')">Düzenle</Button>
  </div>

  <!-- Görüntüleme Modu -->
  <div v-if="!isEditing" class="space-y-4">
    <div v-for="field in [
      { label: 'İsim Soyisim', value: user?.name || '-' },
      { label: 'E-posta Adresi', value: user?.email },
      { label: 'Hesap Türü', value: getRoleText(user?.role) }
    ]" :key="field.label">
      <label class="block text-sm font-medium text-gray-600 mb-1">{{ field.label }}</label>
      <p class="text-gray-900">{{ field.value }}</p>
    </div>
  </div>

  <!-- Düzenleme Modu -->
  <form v-else @submit.prevent="handleSave" class="space-y-4">
    <Input v-model="editForm.name" label="İsim Soyisim" placeholder="Adınızı ve soyadınızı girin" required />
    <Input v-model="editForm.email" type="email" label="E-posta Adresi" placeholder="email@example.com" required />

    <div class="pt-4 border-t border-gray-200">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">Şifre Değiştir (İsteğe Bağlı)</h3>
      <div class="space-y-3">
        <Input 
          v-for="field in [
            { model: 'currentPassword', label: 'Mevcut Şifre', placeholder: 'Mevcut şifreniz' },
            { model: 'newPassword', label: 'Yeni Şifre', placeholder: 'En az 6 karakter' },
            { model: 'confirmPassword', label: 'Yeni Şifre (Tekrar)', placeholder: 'Yeni şifrenizi tekrar girin' }
          ]"
          :key="field.model"
          v-model="editForm[field.model as keyof typeof editForm]" 
          type="password" 
          :label="field.label" 
          :placeholder="field.placeholder" 
        />
      </div>
    </div>

    <div class="flex gap-2 pt-4">
      <Button type="submit" variant="primary" size="lg" flex :loading="isLoading">Kaydet</Button>
      <Button type="button" variant="secondary" @click="emit('cancelEditing')" :disabled="isLoading">İptal</Button>
    </div>
  </form>
</template>

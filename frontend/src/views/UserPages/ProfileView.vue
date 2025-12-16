<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores";
import { toast } from "vue3-toastify";
import Card from "../../components/common/Card.vue";
import PageHeader from "../../components/layout/PageHeader.vue";
import ProfileForm from "./components/ProfileForm.vue";
import QuickLinks from "./components/QuickLinks.vue";

const router = useRouter();
const authStore = useAuthStore();

const isEditing = ref(false);
const isLoading = ref(false);
const profileFormRef = ref<InstanceType<typeof ProfileForm> | null>(null);

const quickLinks = [
  { to: "/customer-panel", label: "Kullanıcı Paneli", icon: "panel" },
  { to: "/favorilerim", label: "Favorilerim", icon: "heart" }
];

onMounted(() => {
  if (!authStore.isLoggedIn) {
    toast.error("Lütfen giriş yapın!");
    router.push("/login");
    return;
  }

  if (profileFormRef.value) {
    profileFormRef.value.initForm(authStore.user);
  }
});

function startEditing() {
  isEditing.value = true;
  if (profileFormRef.value) {
    profileFormRef.value.initForm(authStore.user);
  }
}

function cancelEditing() {
  isEditing.value = false;
  if (profileFormRef.value) {
    profileFormRef.value.initForm(authStore.user);
  }
}

function validateForm(form: any): boolean {
  if (!form.name?.trim() || !form.email?.trim()) {
    toast.error("İsim ve email alanları zorunludur!");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    toast.error("Geçerli bir email adresi giriniz!");
    return false;
  }

  const isPasswordChange = form.currentPassword || form.newPassword || form.confirmPassword;

  if (isPasswordChange) {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Şifre değiştirmek için tüm şifre alanlarını doldurun!");
      return false;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor!");
      return false;
    }

    if (form.newPassword.length < 6) {
      toast.error("Yeni şifre en az 6 karakter olmalıdır!");
      return false;
    }

    if (form.currentPassword === form.newPassword) {
      toast.error("Yeni şifre mevcut şifrenizle aynı olamaz!");
      return false;
    }
  }

  return true;
}

async function saveProfile(form: any) {
  if (!validateForm(form)) return;

  isLoading.value = true;

  const isPasswordChange = form.currentPassword || form.newPassword;

  const updateData: any = {
    name: form.name,
    email: form.email
  };

  if (isPasswordChange) {
    updateData.currentPassword = form.currentPassword;
    updateData.newPassword = form.newPassword;
  }

  const result = await authStore.updateProfile(updateData);

  isLoading.value = false;

  if (result.error) {
    toast.error(result.error);
    return;
  }

  toast.success(isPasswordChange ? "Profil ve şifre başarıyla güncellendi!" : "Profil başarıyla güncellendi!");
  isEditing.value = false;
  if (profileFormRef.value) {
    profileFormRef.value.initForm(authStore.user);
  }
}
</script>

<template>
  <div class="min-h-screen max-w-3xl mx-auto p-6">
    <PageHeader title="Profilim" show-back />

    <!-- Profil Bilgileri -->
    <Card padding="lg" class="mb-4">
      <ProfileForm
        ref="profileFormRef"
        :user="authStore.user"
        :is-editing="isEditing"
        :is-loading="isLoading"
        @start-editing="startEditing"
        @cancel-editing="cancelEditing"
        @save-profile="saveProfile"
      />
    </Card>

    <!-- Hızlı Erişim -->
    <Card padding="lg">
      <QuickLinks
        :links="quickLinks"
        :user-role="authStore.user?.role"
      />
    </Card>
  </div>
</template>
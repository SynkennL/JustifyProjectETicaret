<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useAuthStore, useCartStore } from "../../stores";
import Button from "../../components/common/Button.vue";
import Input from "../../components/common/Input.vue";
import AuthLayout from "./components/AuthLayout.vue";
import AuthFormHeader from "./components/AuthFormHeader.vue";
import AuthFooter from "./components/AuthFooter.vue";
import RoleSelector from "./components/RoleSelector.vue";

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const name = ref("");
const email = ref("");
const password = ref("");
const role = ref<'customer' | 'admin'>("customer");
const error = ref("");

async function submit() {
  error.value = "";
  
  const result = await authStore.register(name.value, email.value, password.value, role.value);
  
  if (result.error) {
    error.value = result.error;
    return;
  }
  
  cartStore.clearGuest();

  await router.push("/");
  setTimeout(() => location.reload(), 100);
}
</script>

<template>
  <AuthLayout max-width="lg">
    <!-- Header -->
    <AuthFormHeader
      title="Hesap Oluştur"
      description="JustifyShop'a hoş geldiniz"
      icon="register"
    />

    <!-- Register Form -->
    <form @submit.prevent="submit" class="space-y-5">
      <Input
        v-model="name"
        label="İsim Soyisim"
        placeholder="Adınızı girin"
        required
        autocomplete="name"
      />

      <Input
        v-model="email"
        type="email"
        label="E-posta Adresi"
        placeholder="ornek@email.com"
        required
        autocomplete="email"
      />

      <Input
        v-model="password"
        type="password"
        label="Şifre"
        placeholder="En az 6 karakter"
        required
        autocomplete="new-password"
      />

      <!-- Role Selector -->
      <RoleSelector v-model="role" />

      <!-- Error Message -->
      <p v-if="error" class="text-red-500 text-sm bg-red-50 py-2 px-4 rounded-lg border border-red-200">
        {{ error }}
      </p>

      <!-- Submit Button -->
      <Button 
        type="submit" 
        variant="primary" 
        size="lg" 
        full-width 
        :loading="authStore.loading"
      >
        Hesap Oluştur
      </Button>
    </form>

    <!-- Footer -->
    <AuthFooter type="register" />
  </AuthLayout>
</template>
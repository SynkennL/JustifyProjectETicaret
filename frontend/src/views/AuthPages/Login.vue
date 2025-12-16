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

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const email = ref("");
const password = ref("");
const error = ref("");

async function submit() {
  error.value = "";
  
  const result = await authStore.login(email.value, password.value);
  
  if (result.error) {
    error.value = result.error;
    return;
  }
  
  if (result.user) {
    await cartStore.removeOwnedProducts(result.user.id);
  }
  
  await router.push("/");
  setTimeout(() => location.reload(), 100);
}
</script>

<template>
  <AuthLayout max-width="md">
    <!-- Header -->
    <AuthFormHeader
      title="Giriş Yap"
      description="Hesabınıza erişmek için giriş yapın"
      icon="login"
    />

    <!-- Login Form -->
    <form @submit.prevent="submit" class="space-y-4">
      <Input
        v-model="email"
        type="email"
        label="E-posta"
        placeholder="ornek@email.com"
        required
        autocomplete="email"
      />

      <Input
        v-model="password"
        type="password"
        label="Şifre"
        placeholder="Şifrenizi girin"
        required
        autocomplete="current-password"
      />

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
        Giriş Yap
      </Button>
    </form>


    <!-- Footer -->
    <AuthFooter type="login" />
  </AuthLayout>
</template>
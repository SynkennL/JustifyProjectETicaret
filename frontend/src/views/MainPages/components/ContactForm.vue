<script setup lang="ts">
import { ref } from "vue";
import Button from "../../../components/common/Button.vue";
import Input from "../../../components/common/Input.vue";

const name = ref("");
const email = ref("");
const subject = ref("");
const message = ref("");

const subjectOptions = [
  { value: "", label: "Konu Seçiniz" },
  { value: "Şikayet & Öneri", label: "Şikayet & Öneri" },
  { value: "Sipariş Takibi", label: "Sipariş Takibi" },
  { value: "Ürün Bilgisi", label: "Ürün Bilgisi" },
  { value: "Diğer", label: "Diğer" }
];
</script>

<template>
  <form action="https://api.web3forms.com/submit" method="POST" class="space-y-5">
    <input type="hidden" name="access_key" value="76c70e8f-bd3a-44bc-a215-cb30fe03d068">

    <Input
      v-model="name"
      name="İsim Ve Soyisim"
      label="İsim (Zorunlu)"
      placeholder="İsim ve Soyisim Giriniz."
      required
    />

    <Input
      v-model="email"
      type="email"
      name="E-posta"
      label="E-Posta (Zorunlu)"
      placeholder="E-Posta Giriniz."
      required
    />

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Konu (Zorunlu) <span class="text-red-600">*</span>
      </label>
      <select 
        v-model="subject"
        name="Konu" 
        required
        class="w-full py-3 px-4 bg-gray-50 border-2 border-gray-200 focus:border-slate-900 focus:bg-white text-sm outline-0 rounded-lg transition-all"
      >
        <option v-for="opt in subjectOptions" :key="opt.value" :value="opt.value" :disabled="!opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Mesaj (Zorunlu) <span class="text-red-600">*</span>
      </label>
      <textarea 
        v-model="message"
        name="Mesaj" 
        rows="6" 
        placeholder="Mesajınız"
        required
        class="w-full py-3 px-4 bg-gray-50 border-2 border-gray-200 focus:border-slate-900 focus:bg-white text-sm outline-0 rounded-lg transition-all"
      />
    </div>

    <Button type="submit" variant="primary" size="lg" full-width>
      Gönder
    </Button>
  </form>

  <div class="flex items-start p-4 mt-4 text-sm rounded-xl bg-blue-700 hover:scale-105 transition duration-500">
    <svg class="w-5 h-5 mr-2 shrink-0 mt-0.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p class="font-bold text-gray-200">
      <span class="font-bold mr-2 text-black">Bilgilendirme!</span>
      Formu doldururken bilgilerin eksiksiz olduğundan ve kesinliğinden emin olunuz.
    </p>
  </div>
</template>

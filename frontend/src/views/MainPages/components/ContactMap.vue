<script setup lang="ts">
import Card from "../../../components/common/Card.vue";

defineProps<{
  address?: string;
}>();

const defaultAddress = "Barbaros Hayrettin Paşa, 1993. Sk. Ferah Residence No:22/A D:119, 34522 Esenyurt/İstanbul";
</script>

<template>
  <div class="space-y-4">
    <!-- Harita ve Adres Bilgisi -->
    <Card padding="lg">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        Adresimiz
      </h3>
      <p class="text-gray-600 text-sm mb-4">
        {{ address || defaultAddress }}
      </p>
      
      <!-- Google Maps Embed -->
      <div class="rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.340028212324!2d28.636660275859025!3d41.01781627134916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b55f5e5be6e115%3A0x8c848dbaf0d49ebc!2sFerah%20Residence!5e0!3m2!1str!2str!4v1765956446633!5m2!1str!2str"
          width="100%" 
          height="300" 
          style="border:0;" 
          allowfullscreen
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade"
          class="w-full"
        ></iframe>
      </div>
    </Card>

    <!-- İletişim Bilgileri -->
    <Card padding="lg">
      <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        İletişim Bilgileri
      </h3>
      <div class="space-y-3 text-sm text-gray-600">
        <a :href="`https://maps.google.com/?q=${encodeURIComponent(address || defaultAddress)}`" 
           target="_blank" 
           class="flex items-center gap-3 hover:text-blue-600 transition-colors">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Google Maps'te Aç
        </a>
      </div>
    </Card>
  </div>
</template>

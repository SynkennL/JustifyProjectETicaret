<script setup lang="ts">
import Card from "../../components/common/Card.vue";
import PageHeader from "../../components/layout/PageHeader.vue";
import ContactForm from "./components/ContactForm.vue";
import ContactMap from "./components/ContactMap.vue";
</script>

<template>
  <div class="min-h-screen max-w-6xl mx-auto px-4 py-8">
    <PageHeader 
      title="Bizimle İletişime Geç" 
      description="Sorularınız için bize ulaşın"
    />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- İletişim Formu -->
      <Card padding="lg">
        <ContactForm />
      </Card>

      <!-- Harita ve Adres Bilgisi -->
      <ContactMap />
    </div>
  </div>
</template>
<script setup lang="ts">
import Card from "../../components/common/Card.vue";
import PageHeader from "../../components/layout/PageHeader.vue";
import ContactForm from "./components/ContactForm.vue";
</script>

<template>
  <div class="min-h-screen max-w-2xl mx-auto px-4 py-8">
    <PageHeader 
      title="Bizimle İletişime Geç" 
      description="Sorularınız için bize ulaşın"
    />

    <Card padding="lg">
      <ContactForm />
    </Card>
  </div>
</template>
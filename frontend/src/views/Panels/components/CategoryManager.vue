<script setup lang="ts">
import Button from "../../../components/common/Button.vue";
import Input from "../../../components/common/Input.vue";
import Card from "../../../components/common/Card.vue";
import EmptyState from "../../../components/common/EmptyState.vue";

defineProps<{
  categories: { id: number; name: string; slug: string }[];
  catName: string;
  catSlug: string;
}>();

const emit = defineEmits<{
  (e: 'update:catName', value: string): void;
  (e: 'update:catSlug', value: string): void;
  (e: 'addCategory'): void;
}>();
</script>

<template>
  <!-- Kategori Ekle -->
  <Card title="➕ Kategori Ekle" padding="md" class="mb-8">
    <div class="flex gap-2">
      <Input :model-value="catName" @update:model-value="emit('update:catName', $event)" placeholder="Kategori adı" />
      <Input :model-value="catSlug" @update:model-value="emit('update:catSlug', $event)" placeholder="Slug (örn: erkek-giyim)" />
      <Button variant="success" @click="emit('addCategory')">Ekle</Button>
    </div>
  </Card>

  <!-- Mevcut Kategoriler -->
  <Card title="📂 Mevcut Kategoriler" padding="md" class="mb-8">
    <EmptyState 
      v-if="categories.length === 0"
      title="Henüz kategori bulunmuyor"
      icon="product"
    />

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-2">
      <div v-for="cat in categories" :key="cat.id" class="bg-gray-100 p-3 rounded text-center">
        <p class="font-medium">{{ cat.name }}</p>
        <p class="text-xs text-gray-500">{{ cat.slug }}</p>
      </div>
    </div>
  </Card>
</template>

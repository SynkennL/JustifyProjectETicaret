<script setup lang="ts">
defineProps<{
  categories: { name: string; slug: string }[];
  categoryImages: Record<string, string>;
}>();
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-12 bg-white">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Popüler Kategoriler</h2>
        <p class="text-gray-600">En çok tercih edilen kategorilerimizi keşfedin</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <RouterLink 
          v-for="category in categories"
          :key="category.slug"
          :to="`/kategori/${category.slug}`" 
          class="group"
        >
          <div class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div class="relative overflow-hidden aspect-video">
              <img 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                :src="categoryImages[category.slug]" 
                :alt="category.name"
              >
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-3 left-3 right-3">
                <h3 class="text-white font-bold text-lg mb-0.5">{{ category.name }}</h3>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

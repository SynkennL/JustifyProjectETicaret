<script setup lang="ts">
defineProps<{
  images: string[];
  currentIndex: number;
  title: string;
}>();

const emit = defineEmits<{
  (e: 'changeImage', index: number): void;
  (e: 'prevImage'): void;
  (e: 'nextImage'): void;
}>();
</script>

<template>
  <div>
    <div class="relative border rounded-lg overflow-hidden bg-white mb-3">
      <img :src="images[currentIndex]" :alt="title" class="w-full aspect-square object-cover" />
      <button v-if="images.length > 1" @click="emit('prevImage')" class="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow hover:bg-gray-100 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button v-if="images.length > 1" @click="emit('nextImage')" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow hover:bg-gray-100 transition">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div v-if="images.length > 1" class="flex gap-2 overflow-x-auto">
      <button 
        v-for="(image, index) in images" 
        :key="index" 
        @click="emit('changeImage', index)" 
        :class="['flex-shrink-0 w-16 h-16 rounded border-2', currentIndex === index ? 'border-gray-900' : 'border-gray-200']"
      >
        <img :src="image" class="w-full h-full object-cover rounded" />
      </button>
    </div>
  </div>
</template>

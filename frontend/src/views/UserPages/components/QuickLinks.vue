<script setup lang="ts">
defineProps<{
  links: { to: string; label: string; icon: string }[];
  userRole?: string;
}>();
</script>

<template>
  <h2 class="text-lg font-semibold text-slate-900 mb-4">Hızlı Erişim</h2>
  <div class="space-y-2">
    <RouterLink 
      v-for="link in [...links, ...(userRole === 'admin' ? [{ to: '/admin', label: 'Admin Paneli', icon: 'admin' }] : [])]"
      :key="link.to"
      :to="link.to" 
      class="flex items-center gap-2 p-3 rounded hover:bg-gray-50 transition text-gray-700"
    >
      <span class="text-sm font-medium">{{ link.label }}</span>
    </RouterLink>
  </div>
</template>

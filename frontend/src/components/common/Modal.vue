<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue';

interface Props {
  modelValue: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
  persistent?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  persistent: false,
  variant: 'default'
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
}>();

// Size classes
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };
  return sizes[props.size];
});

const variantClasses = computed(() => {
  const variants = {
    default: 'border-slate-200',
    success: 'border-green-200',
    warning: 'border-amber-200',
    danger: 'border-red-200',
    info: 'border-blue-200'
  };
  return variants[props.variant];
});

// Close modal
const closeModal = () => {
  emit('update:modelValue', false);
  emit('close');
};

// Handle backdrop click
const handleBackdropClick = () => {
  if (!props.persistent) {
    closeModal();
  }
};

// Handle ESC key
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue && !props.persistent) {
    closeModal();
  }
};

// Prevent body scroll when modal is open
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

onMounted(() => {
  document.addEventListener('keydown', handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          @click="handleBackdropClick"
        />

        <!-- Modal Content -->
        <div
          :class="[
            'relative w-full bg-white rounded-xl shadow-2xl transform transition-all',
            sizeClasses
          ]"
          @click.stop
        >
          <!-- Header -->
          <div
            v-if="title || closable"
            :class="[
              'flex items-center gap-3 p-5 border-b',
              variantClasses
            ]"
          >
            <!-- Title -->
            <h3 v-if="title" class="flex-1 text-lg font-semibold text-gray-900">
              {{ title }}
            </h3>

            <!-- Close Button -->
            <button
              v-if="closable"
              @click="closeModal"
              class="flex-shrink-0 p-2 -m-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 text-gray-600">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
</style>

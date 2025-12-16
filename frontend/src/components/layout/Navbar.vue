<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useCartStore, useFavoritesStore, useCompareStore, useProductStore, useAuthStore } from "../../stores";

const isMobileMenuOpen = ref(false)
const isDropdownOpenMobile = ref(false)
const isUserDropdownOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
const showSearchResults = ref(false)

const router = useRouter();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();
const compareStore = useCompareStore();
const productStore = useProductStore();
const authStore = useAuthStore();


const categories = [
  { name: "Erkek Giyim", slug: "erkek-giyim" },
  { name: "Kadın Giyim", slug: "kadin-giyim" },
  { name: "Ayakkabı", slug: "ayakkabi" },
  { name: "Çocuk Giyim", slug: "cocuk-giyim" }
];

const navItems = [
  { to: "/", label: "Anasayfa" },
  { to: "/hakkimizda", label: "Hakkımızda" },
  { to: "/iletisim", label: "İletişim" }
];

const iconButtons = computed(() => [
  {
    to: "/karsilastir",
    icon: "compare",
    title: "Karşılaştır",
    badge: compareStore.count,
    badgeColor: "bg-blue-600"
  },
  {
    to: "/favorilerim",
    icon: "heart",
    title: "Favorilerim",
    badge: favoritesStore.count,
    badgeColor: "bg-red-600"
  },
  {
    to: "/cart",
    icon: "cart",
    title: "Sepetim",
    badge: cartStore.totalItems,
    badgeColor: "bg-slate-900"
  }
]);


function logout() {
  authStore.logout();
  cartStore.clearGuest();
  favoritesStore.clear();
  router.push("/");
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    isDropdownOpenMobile.value = false;
    isUserDropdownOpen.value = false;
  }
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
  isDropdownOpenMobile.value = false;
}

function closeSearch() {
  searchQuery.value = '';
  searchResults.value = [];
  showSearchResults.value = false;
  isSearchOpen.value = false;
}

function getFirstImage(imageUrl: string | null | undefined): string {
  if (!imageUrl) return 'https://via.placeholder.com/80';
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
  } catch {}
  return imageUrl;
}

function selectProduct(productId: number) {
  router.push(`/urun/${productId}`);
  closeSearch();
}

let searchTimeout: any = null;

watch(searchQuery, async (newVal) => {
  if (searchTimeout) clearTimeout(searchTimeout);

  if (!newVal.trim()) {
    searchResults.value = [];
    showSearchResults.value = false;
    return;
  }

  searchTimeout = setTimeout(async () => {
    await performSearch(newVal);
  }, 300);
});

async function performSearch(query: string) {
  if (!query.trim()) return;

  isSearching.value = true;
  try {
    const products = await productStore.fetchProducts();
    const filtered = products.filter((p: any) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase()) ||
      p.category_name?.toLowerCase().includes(query.toLowerCase())
    );
    searchResults.value = filtered.slice(0, 5);
    showSearchResults.value = true;
  } catch (error) {
    console.error("Arama hatası:", error);
  } finally {
    isSearching.value = false;
  }
}


onMounted(() => {
  favoritesStore.loadIds();
});
</script>

<template>
  <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Logo -->
        <RouterLink to="/" class="flex-shrink-0">
          <img src="../../assets/icon/justlogopurplee.png" class="h-32 mt-3 w-auto hover:opacity-90 transition-opacity" alt="JustifyShop" />
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex items-center space-x-8 flex-1 justify-center">
          <RouterLink 
            v-for="item in navItems" 
            :key="item.to"
            :to="item.to" 
            class="text-sm font-medium text-gray-700 hover:text-slate-900 transition-colors"
          >
            {{ item.label }}
          </RouterLink>

          <!-- Categories Dropdown -->
          <div class="relative group">
            <button class="text-sm font-medium text-gray-700 hover:text-slate-900 transition-colors flex items-center gap-1">
              Kategoriler
              <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <RouterLink 
                v-for="(cat, idx) in categories" 
                :key="cat.slug"
                :to="`/kategori/${cat.slug}`"
                :class="[
                  'block px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 transition-colors',
                  idx === 0 ? 'first:rounded-t-lg' : '',
                  idx === categories.length - 1 ? 'last:rounded-b-lg' : ''
                ]"
              >
                {{ cat.name }}
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Desktop Actions -->
        <div class="hidden lg:flex items-center space-x-2">
          <!-- Search Button -->
          <button @click="isSearchOpen = true" class="p-2.5 text-gray-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all" title="Ara">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Icon Buttons (Compare, Favorites, Cart) -->
          <RouterLink 
            v-for="btn in iconButtons" 
            :key="btn.to"
            :to="btn.to"
            class="relative p-2.5 text-gray-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
            :title="btn.title"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="btn.icon === 'compare'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              <path v-else-if="btn.icon === 'heart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              <path v-else-if="btn.icon === 'cart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="btn.badge" :class="['absolute -top-1 -right-1 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold', btn.badgeColor]">
              {{ btn.badge }}
            </span>
          </RouterLink>

          <!-- User Menu -->
          <div v-if="!authStore.isLoggedIn" class="flex items-center gap-2 border-gray-200">
            <RouterLink to="/login">
              <button class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-slate-900 transition-colors">Giriş</button>
            </RouterLink>
            <RouterLink to="/register">
              <button class="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all">Kayıt Ol</button>
            </RouterLink>
          </div>

          <div v-else class="relative pl-1 border-gray-200">
            <button @click="isUserDropdownOpen = !isUserDropdownOpen" class="flex items-center gap-2 p-2 text-gray-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isUserDropdownOpen }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div v-if="isUserDropdownOpen" @click="isUserDropdownOpen = false" class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1">
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user?.name || authStore.user?.email }}</p>
              </div>

              <RouterLink to="/profil" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 transition-colors">Profilim</RouterLink>
              <RouterLink to="/customer-panel" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 transition-colors">Kullanıcı Paneli</RouterLink>
              <RouterLink v-if="authStore.isAdmin" to="/admin" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 transition-colors">Admin Paneli</RouterLink>
              
              <button @click="logout" class="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">Çıkış Yap</button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="toggleMobileMenu" class="lg:hidden p-2 text-gray-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
          <svg v-if="!isMobileMenuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="lg:hidden bg-white border-t border-gray-200">
      <div class="px-4 py-3 space-y-1">
        <!-- Mobile Search -->
        <div class="mb-3 pb-3 border-b border-gray-200">
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Ürün ara..." class="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-slate-900 focus:outline-none text-sm" />
            <svg class="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Mobile Search Results -->
          <div v-if="showSearchResults && searchQuery" class="mt-2 max-h-64 overflow-y-auto bg-gray-50 rounded-lg">
            <div v-if="isSearching" class="p-4 text-center">
              <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-900"></div>
            </div>
            <div v-else-if="searchResults.length === 0" class="p-4 text-center text-sm text-gray-500">Sonuç bulunamadı</div>
            <div v-else>
              <button v-for="product in searchResults" :key="product.id" @click="selectProduct(product.id); closeMobileMenu()" class="w-full flex items-center gap-3 p-2 hover:bg-white transition">
                <img :src="getFirstImage(product.image_url)" :alt="product.title" class="w-12 h-12 object-cover rounded" />
                <div class="flex-1 text-left">
                  <p class="font-medium text-xs text-gray-900 line-clamp-1">{{ product.title }}</p>
                  <p class="font-bold text-xs text-gray-900">{{ product.price }} TL</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Nav Items -->
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" @click="closeMobileMenu" class="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
          {{ item.label }}
        </RouterLink>

        <!-- Mobile Categories -->
        <button @click="isDropdownOpenMobile = !isDropdownOpenMobile" class="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
          Kategoriler
          <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isDropdownOpenMobile }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-if="isDropdownOpenMobile" class="pl-4 space-y-1">
          <RouterLink v-for="cat in categories" :key="cat.slug" :to="`/kategori/${cat.slug}`" @click="closeMobileMenu" class="block px-4 py-2 text-sm text-gray-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
            {{ cat.name }}
          </RouterLink>
        </div>

        <!-- Mobile Icon Buttons -->
        <RouterLink 
          v-for="btn in iconButtons" 
          :key="btn.to"
          :to="btn.to" 
          @click="closeMobileMenu" 
          class="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
          :class="btn.to === '/karsilastir' ? 'border-t border-gray-100 mt-2 pt-3' : ''"
        >
          <span>{{ btn.title }}</span>
          <span v-if="btn.badge" :class="['text-white rounded-full px-2.5 py-0.5 text-xs font-bold', btn.badgeColor]">{{ btn.badge }}</span>
        </RouterLink>

        <!-- Mobile User Menu -->
        <div v-if="!authStore.isLoggedIn" class="pt-3 space-y-2 border-t border-gray-100">
          <RouterLink to="/login" @click="closeMobileMenu" class="block px-4 py-3 text-sm font-medium text-center text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all">Giriş Yap</RouterLink>
          <RouterLink to="/register" @click="closeMobileMenu" class="block px-4 py-3 text-sm font-medium text-center text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all">Kayıt Ol</RouterLink>
        </div>

        <div v-else class="pt-3 space-y-1 border-t border-gray-100">
          <div class="px-4 py-3 bg-slate-50 rounded-lg mb-2">
            <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user?.email || '' }}</p>
          </div>

          <RouterLink to="/profil" @click="closeMobileMenu" class="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">Profilim</RouterLink>
          <RouterLink to="/customer-panel" @click="closeMobileMenu" class="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">Kullanıcı Paneli</RouterLink>
          <RouterLink v-if="authStore.isAdmin" to="/admin" @click="closeMobileMenu" class="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">Admin Paneli</RouterLink>
          
          <button @click="logout" class="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all">Çıkış Yap</button>
        </div>
      </div>
    </div>

    <!-- Desktop Search Modal -->
    <Transition name="fade">
      <div v-if="isSearchOpen" class="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-20 px-4" @click="closeSearch">
        <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center gap-4">
              <div class="relative flex-1">
                <input v-model="searchQuery" type="text" placeholder="Ürün ara..." class="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-slate-900 focus:outline-none text-base" autofocus />
                <svg class="absolute left-4 top-3.5 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button @click="closeSearch" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="showSearchResults" class="max-h-96 overflow-y-auto">
            <div v-if="isSearching" class="p-12 text-center">
              <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-gray-900"></div>
              <p class="text-gray-600 mt-4">Aranıyor...</p>
            </div>
            <div v-else-if="searchResults.length === 0" class="p-12 text-center">
              <p class="text-gray-500 text-lg">Sonuç bulunamadı</p>
            </div>
            <div v-else class="divide-y divide-gray-100">
              <button v-for="product in searchResults" :key="product.id" @click="selectProduct(product.id)" class="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                <img :src="getFirstImage(product.image_url)" :alt="product.title" class="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                <div class="flex-1 text-left min-w-0">
                  <p class="font-semibold text-gray-900 line-clamp-1">{{ product.title }}</p>
                  <p class="text-sm text-gray-500 line-clamp-1 mt-0.5">{{ product.category_name }}</p>
                  <p class="font-bold text-lg text-slate-900 mt-1">{{ product.price }} TL</p>
                </div>
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
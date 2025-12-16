<script setup lang="ts">
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <div data-hs-carousel='{"loadingClasses": "opacity-0"}' class="relative">
      <div class="hs-carousel relative overflow-hidden w-full h-96 md:h-[500px] bg-gray-100 rounded-xl">
        <div class="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 opacity-0">
          <div class="hs-carousel-slide">
            <div class="h-96 md:h-[500px] flex flex-col bg-[url('./assets/slider-images/herobanner1.png')] bg-cover bg-center bg-no-repeat relative">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div class="mt-auto w-2/3 md:max-w-lg ps-6 pb-6 md:ps-12 md:pb-12 relative z-10">
                <span class="block text-white text-sm font-bold mb-3 bg-red-600 px-4 py-2 rounded-lg inline-block shadow-lg">
                  Yılbaşı İndirimleri
                </span>
                <span class="block text-white text-2xl md:text-3xl font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] leading-tight">
                  Şuanda mevcut olan yılbaşı indirimlerinden ürünlerimizden satın alarak yararlanabilirsiniz!
                </span>
              </div>
            </div>
          </div>
          <div class="hs-carousel-slide">
            <div class="h-96 md:h-[500px] flex flex-col bg-[url('./assets/slider-images/herobanner2.png')] bg-cover bg-center bg-no-repeat relative">
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div class="mt-auto w-2/3 md:max-w-lg ps-6 pb-6 md:ps-12 md:pb-12 relative z-10">
                <span class="block text-white text-sm font-bold mb-3 bg-blue-600 px-4 py-2 rounded-lg inline-block shadow-lg">
                  Açılışa Özel İndirim
                </span>
                <span class="block text-white text-2xl md:text-3xl font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] leading-tight">
                  Açılışa özel uygun ve indirimli fiyatlı ürünler sizi bekliyor!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button type="button" class="hs-carousel-prev hs-carousel-disabled:opacity-50 disabled:pointer-events-none absolute inset-y-0 start-0 inline-flex justify-center items-center w-10 h-full text-white hover:bg-black/20 rounded-s-xl">
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
        </svg>
      </button>

      <button type="button" class="hs-carousel-next hs-carousel-disabled:opacity-50 disabled:pointer-events-none absolute inset-y-0 end-0 inline-flex justify-center items-center w-10 h-full text-white hover:bg-black/20 rounded-e-xl">
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
        </svg>
      </button>
    </div>
  </div>
</template>

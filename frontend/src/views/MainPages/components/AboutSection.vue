<script setup lang="ts">
import Button from '../../../components/common/Button.vue';
</script>

<template>
  <section class="min-h-screen py-20 md:py-32 relative">
    <div class="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
      <div class="w-full justify-start items-center gap-8 grid lg:grid-cols-2 grid-cols-1">
        <div class="w-full flex-col justify-start lg:items-start items-center gap-10 inline-flex">
          <div class="w-full flex-col justify-start lg:items-start items-center gap-4 flex">
            <h2 class="text-gray-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
              Hakkımızda
            </h2>
            <p class="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center">
              JustifyShop olarak, moda tutkunlarına en trend ürünleri sunma misyonuyla yola çıktık.
              Müşteri memnuniyetini ön planda tutarak, güvenli alışveriş deneyimi ve hızlı teslimat ile sektörde
              fark yaratıyoruz. Geniş ürün yelpazemizle her zevke hitap eden JustifyShop'ta, stilinizi bulabilirsiniz.
            </p>
          </div>
          <RouterLink to="/">
            <Button variant="primary" size="lg">
              Anasayfaya Git
            </Button>
          </RouterLink>
        </div>
        <img 
          class="lg:mx-0 mx-auto h-full rounded-3xl object-cover"
          src="https://cms.ikas.com/wp-content/uploads/2024/10/hakkimizda-sayfasi-nedir-nasil-olusturulur.webp"
          alt="about Us image" 
        />
      </div>
    </div>
  </section>
</template>

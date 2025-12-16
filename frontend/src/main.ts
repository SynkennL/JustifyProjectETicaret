import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import 'preline'
import "vue3-toastify/dist/index.css";
import Vue3Toastify from 'vue3-toastify';
import { router } from './router'

const app = createApp(App)
const pinia = createPinia()

router.afterEach(() => {
  setTimeout(() => {
    if (typeof window !== 'undefined' && (window as any).HSStaticMethods) {
      (window as any).HSStaticMethods.autoInit();
    }
  }, 100);
});

app.use(pinia)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right"
})
app.use(router).mount('#app')
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import './style.css'
import App from './App.vue'
import { messages } from './i18n'

const savedLocale = localStorage.getItem('locale')
const locale = savedLocale === 'en' ? 'en' : 'es'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'es',
  messages,
})

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.mount('#app')

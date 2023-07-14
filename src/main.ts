import { createApp } from 'vue'
import router from '@/router/index'
import './style.css'
import 'animate.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { Lazyload } from 'vant'
import Vue3Lottie from 'vue3-lottie'
import 'vant/es/notify/style'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(Lazyload, {
  lazyComponent: true
})
app.use(Vue3Lottie, { name: 'Vue3Lottie' })
app.mount('#app')

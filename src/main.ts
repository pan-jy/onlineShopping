import { createApp } from 'vue'
import router from '@/router/index'
import './style.css'
import 'animate.css'
import App from './App.vue'
import { Lazyload } from 'vant'
import Vue3Lottie from 'vue3-lottie'
import 'vant/es/notify/style'

const app = createApp(App)
app.use(router)
app.use(Lazyload, {
  lazyComponent: true
})
app.use(Vue3Lottie, {name: 'Vue3Lottie'})
app.mount('#app')

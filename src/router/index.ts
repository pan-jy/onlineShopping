import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home', // 首页
    component: () => import('@/pages/Home.vue'),
    meta: { isTab: true }
  },
  {
    path: '/login',
    component: () => import('@/pages/Login.vue')
  },
  {
    path: '/cart', // 购物车
    component: () => import('@/pages/Cart.vue'),
    meta: { isTab: true, auth: true }
  },
  {
    path: '/profile',
    component: () => import('@/pages/Profile.vue'),
    meta: { isTab: true, auth: true }
  },
  {
    path: '/search',
    component: () => import('@/pages/Search.vue')
  },
  {
    path: '/commodity-detail',
    component: () => import('@/pages/CommodityDetail.vue'),
    meta: { animation: 'animate__fadeIn' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.meta.auth) {
    const token = localStorage.getItem('token')
    if (!token) {
      return '/login'
    }
  }
})

export default router

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
    meta: { isTab: true, keepAlive: true }
  },
  {
    path: '/login',
    component: () => import('@/pages/Login.vue')
  },
  {
    path: '/cart', // 购物车
    component: () => import('@/pages/Cart.vue'),
    meta: { isTab: true, navTitle: '购物车', navRightIcon: 'search' }
  },
  {
    path: '/profile',
    component: () => import('@/pages/Profile.vue'),
    meta: { isTab: true }
  },
  {
    path: '/address-list',
    component: () => import('@/pages/AddressList.vue'),
    meta: { navTitle: '地址管理', leftArrow: true }
  },
  {
    path: '/add-address',
    component: () => import('@/pages/AddAddress.vue'),
    meta: { navTitle: '新增地址', leftArrow: true }
  },
  {
    path: '/edit-address',
    component: () => import('@/pages/EditAddress.vue'),
    meta: { navTitle: '编辑地址', leftArrow: true }
  },
  {
    path: '/view-record',
    component: () => import('@/pages/ViewRecord.vue'),
    meta: { navTitle: '浏览记录', leftArrow: true, navRightIcon: 'search' }
  },
  {
    path: '/search',
    component: () => import('@/pages/Search.vue')
  },
  {
    path: '/commodity-detail',
    component: () => import('@/pages/CommodityDetail.vue'),
    meta: { animation: 'animate__fadeIn' }
  },
  {
    path: '/settlement',
    component: () => import('@/pages/Settlement.vue'),
    meta: { navTitle: '确认订单', leftArrow: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

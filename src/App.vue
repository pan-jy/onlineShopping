<template>
  <router-view #default="{ Component }" :class="{ 'is-tab': isTab }">
    <transition :enter-active-class="enterActiveClass">
      <component :is="Component" />
    </transition>
  </router-view>
  <van-tabbar route v-show="isTab">
    <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
    <van-tabbar-item icon="cart-o" to="/cart">购物车</van-tabbar-item>
    <van-tabbar-item icon="friends-o" to="/profile">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const isTab = ref(false)
const enterActiveClass = ref('animate__animated animate__fadeInDown')
// 每次路有变化时获取meta.isTab
router.afterEach((to) => {
  if (to.meta.animation) {
    enterActiveClass.value =
      enterActiveClass.value.split(' ')[0] + ' ' + to.meta.animation
  }
  isTab.value = to.meta.isTab as boolean
})
</script>

<style lang="scss" scoped>
.is-tab {
  padding-bottom: 50px;
}
</style>

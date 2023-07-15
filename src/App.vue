<template>
  <van-nav-bar
    v-show="route.meta.navTitle"
    :title="(route.meta.navTitle as string | undefined)"
    :left-arrow="(route.meta.leftArrow as boolean | undefined)"
    @click-left="router.back()"
  >
    <template #right v-if="route.meta.navRightIcon">
      <van-icon :name="(route.meta.navRightIcon as string)" size="18" />
    </template>
  </van-nav-bar>

  <router-view #default="{ Component }" :class="{ 'is-tab': isTab }">
    <transition :enter-active-class="enterActiveClass">
      <keep-alive :include="['Home']">
        <component :is="Component" :key="route.path" />
      </keep-alive>
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
const route = router.currentRoute
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

.van-nav-bar {
  position: sticky;
  top: 0;
  z-index: 99;
}
</style>

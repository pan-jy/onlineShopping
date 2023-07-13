<template>
  <van-pull-refresh
    style="height: calc(100vh - 50px)"
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <div class="profile">
      <header class="header">
        <van-image class="header-avatar" round :src="userInfo.avatar" />
        <p class="header-username">{{ userInfo.username }}</p>
      </header>
      <article class="main">
        <div class="main-banner">个人主页</div>
        <van-cell value="查看全部" is-link>
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <span class="cell-title">我的订单</span>
          </template>
        </van-cell>

        <van-grid clickable :column-num="3">
          <van-grid-item icon="pending-payment" badge="10" text="待支付" />
          <van-grid-item icon="underway-o" text="待发货" />
          <van-grid-item icon="logistics" text="待收货" />
        </van-grid>

        <van-cell title="管理收货地址" is-link />
        <van-cell title="优惠券" is-link />
        <van-cell title="浏览记录" is-link />
        <van-cell title="退出登录" is-link @click="logout" />
        <!-- <van-cell title="设置" is-link to="/setting" /> -->
      </article>
    </div>
  </van-pull-refresh>
</template>

<script setup lang="ts">
// import { useRouter } from 'vue-router'
import { getUserInfo, logout } from '@/request/apis/user'
import type { UserInfo } from '@/types/user'
import { ref } from 'vue'

// const router = useRouter()
// 初始化userInfo
const userInfo = ref<UserInfo>({} as UserInfo)
getUserInfo()
  .then((info) => {
    userInfo.value = info
  })
  .catch((err) => {
    console.log('🚀 ~ file: Profile.vue:31 ~ err:', err)
  })

const refreshing = ref(false)
function onRefresh() {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}
</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  height: calc(100vh - 50px);

  .header {
    width: 120%;
    transform: translateX(-10%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 3vh 0 6vh 0;
    position: relative;
    background: linear-gradient(to bottom, skyblue, rgb(210, 242, 255));
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;

    &-avatar {
      width: 6rem;
      height: 6rem;
      box-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);
      background-color: #fff;
    }

    &-username {
      margin-top: 2vh;
      font-size: 1.2rem;
      font-weight: bold;
    }
  }

  .main {
    flex: 1;
    background-color: #fff;
    animation: fadeInUp 1s ease-in 0.2s 1 forwards;
    position: relative;

    &-banner {
      position: absolute;
      top: 0;
      height: 10vh;
      transform: translate(-5%, -99%);
      box-sizing: border-box;
      width: 110%;
      padding-top: 5vh;
      background-color: #fff;
      clip-path: ellipse(50% 50% at 50% 100%);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.cell-title {
  font-size: 1rem;
}
</style>

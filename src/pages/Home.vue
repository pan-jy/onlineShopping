<template>
  <div class="home">
    <van-search
      placeholder="请输入搜索关键词"
      @focus="router.push('/search')"
    />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        v-model:error="error"
        :finished="finished"
        finished-text="没有更多了"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
        :immediate-check="false"
      >
        <div class="commodity-list">
          <van-swipe
            class="commodity swiper"
            :autoplay="3000"
            indicator-color="#39a9ed"
          >
            <van-swipe-item class="swiper-item" v-for="commodity in swiperList">
              <van-image
                width="100%"
                height="100%"
                :src="commodity.covers"
                @click="
                  router.push({
                    path: '/commodity-detail',
                    query: { id: commodity.id }
                  })
                "
                lazy-load
              />
            </van-swipe-item>
          </van-swipe>
          <CommodityCard
            class="commodity"
            v-for="commodity in commodityList"
            :key="commodity.id"
            :commodity="commodity"
          />
        </div>
      </van-list>
    </van-pull-refresh>
    <div class="banner" v-if="showBanner">
      <span class="banner-title">登录打开精彩世界</span>
      <van-button
        class="banner-button"
        round
        color="linear-gradient(to right, #00fff0, #0083fe)"
        to="/login"
      >
        立即登录
      </van-button>
    </div>
    <van-back-top bottom="90px" right="10px" />
  </div>
</template>

<script setup lang="ts">
import CommodityCard from '@/components/CommodityCard.vue'
import { onActivated, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Commodity } from '@/types/commodity'
import { getCommodityList } from '@/request/apis/commodity'
const router = useRouter()

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const commodityList: Array<Commodity> = reactive([])
const swiperList: Array<Commodity> = reactive([])

const onRefresh = async () => {
  finished.value = false
  loading.value = true
  commodityList.splice(0)
  await onLoad()
  swiperList.splice(0)
  swiperList.push(...commodityList.splice(0, 4))
  refreshing.value = false
}

const onLoad = async (): Promise<void> => {
  return new Promise(async (resolve) => {
    const data = await getCommodityList(10)
    commodityList.push(...data)
    loading.value = false
    resolve()
  })
}

const showBanner = ref(false)
onMounted(async () => {
  await onLoad()
  swiperList.push(...commodityList.splice(0, 4))
})

onActivated(() => {
  if (localStorage.getItem('token')) {
    showBanner.value = false
  } else {
    showBanner.value = true
  }
})
</script>

<style lang="scss" scoped>
.commodity-list {
  display: flex;
  flex-wrap: wrap;
  animation: fadeInUp 1.5s ease-in 0.1s 1 forwards;
}
.van-search {
  position: sticky;
  top: 0;
  z-index: 99;
}
.van-list {
  margin-top: 20px;
  padding: 0 15px;
}

.swiper {
  width: 49%;
  border-radius: 10px;

  &-item {
    background-color: #fff;
  }
}

.commodity {
  margin-bottom: 10px;

  &:nth-child(odd) {
    margin-right: 2%;
  }
}

.banner {
  box-sizing: border-box;
  position: fixed;
  bottom: 50px;
  width: 100%;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;

  &-title {
    color: white;
    font-size: 0.9rem;
  }

  &-button {
    height: 1.6rem;
    font-size: 0.8rem;
  }
}
</style>

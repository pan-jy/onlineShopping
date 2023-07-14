<template>
  <div>
    <!-- <van-nav-bar title="浏览记录" left-arrow @click-left="router.back()">
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar> -->

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-card
        v-for="commodity in showRecord"
        :key="commodity.id"
        :price="commodity.price"
        :desc="commodity.businessName"
        :title="commodity.tradeName"
        :thumb="commodity.covers"
        @click="
          router.push({
            path: '/commodity-detail',
            query: { id: commodity.id }
          })
        "
        lazy-load
      >
        <template #tags>
          <van-tag plain type="primary" style="margin-right: 5px">
            七天无理由退货
          </van-tag>
          <van-tag plain type="primary">急速退款</van-tag>
        </template>
        <template #num>
          <span>{{ commodity.lastTime.split(' ')[0] }}</span>
        </template>
      </van-card>

      <van-empty
        v-show="viewRecord.length === 0"
        image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
        image-size="80"
        style="margin-top: 50px"
        description="快去看看吧~"
      >
        <van-button
          round
          plain
          type="primary"
          size="small"
          class="empty-button"
          @click="router.replace('/home')"
        >
          去首页
        </van-button>
      </van-empty>
    </van-pull-refresh>

    <van-back-top bottom="30px" right="10px" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getUserViewRecord } from '@/request/apis/user'
import type { ViewRecord } from '@/types/commodity'
import { computed, onMounted, ref } from 'vue'

const router = useRouter()

const viewRecord = ref<ViewRecord[]>([])
const refreshing = ref(false)
const filter = ref('')

const showRecord = computed(() => {
  return viewRecord.value
    .filter((item) => {
      return (
        filter.value === '' ||
        item.tradeName.includes(filter.value) ||
        item.businessName.includes(filter.value)
      )
    })
    .sort((a, b) => {
      return new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
    })
})

function onRefresh() {
  getUserViewRecord().then((data) => {
    viewRecord.value = data
    refreshing.value = false
  })
}

onMounted(() => {
  onRefresh()
})
</script>

<style lang="scss" scoped>
.empty-button {
  background-color: transparent;
  padding: 0 25px;
}
</style>

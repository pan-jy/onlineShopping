<template>
  <section class="recommend">
    <p class="title">为您推荐</p>
    <div class="list">
      <CommodityCard v-for="item in list" :key="item.id" :commodity="item" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { Commodity } from '@/types/commodity'
import { getCommodityList } from '@/request/apis/commodity'
const list: Array<Commodity> = reactive([])

getCommodityList(10).then((data) => {
  list.push(...data)
})
</script>

<style lang="scss" scoped>
.recommend {
  background-color: #fff;
  margin-top: 20px;
  animation: fadeInUp 1.5s ease-in 0.1s 1 forwards;
  padding-bottom: 100px;

  .title {
    font-size: 1rem;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    border-bottom: 1px solid #eee;
    margin-bottom: 0.5rem;
  }

  .card {
    width: 50%;
    border-radius: 0;
  }
}
</style>

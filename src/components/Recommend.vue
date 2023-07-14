<template>
  <section class="recommend">
    <p class="title">为您推荐</p>
    <div class="list">
      <CommodityCard
        v-for="commodity in recommendList"
        :key="commodity.id"
        :commodity="commodity"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Commodity } from '@/types/commodity'

defineProps<{
  recommendList: Array<Commodity>
}>()
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

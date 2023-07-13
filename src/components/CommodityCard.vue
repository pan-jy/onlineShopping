<template>
  <div class="card" @click="toDetail(commodity.id)">
    <van-image width="100%" :src="commodity.covers" lazy-load />
    <div class="info">
      <van-notice-bar class="info-name" :text="commodity.tradeName" />
      <section class="footer">
        <p class="info-price">￥{{ commodity.price }}</p>
        <div class="info-sales">
          <van-icon name="fire-o" color="#ee0a24" />
          <span>{{ commodity.sales }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Commodity } from '@/types/commodity'
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps<{ commodity: Commodity }>()

function toDetail(id: number) {
  router.push({ path: '/commodity-detail', query: { id } })
}
</script>

<style lang="scss" scoped>
.card {
  box-sizing: border-box;
  width: 49%;
  display: inline-flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
}

.info {
  padding: 10px;

  &-name {
    background-color: transparent;
    margin: 0;
    padding: 0;
    font-size: 14px;
    color: #111;
    height: 14px;
    margin-bottom: 6px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &-price {
    font-size: 16px;
    color: #f22;
    font-weight: bold;
  }

  &-sales {
    display: flex;
    font-size: 0.6rem;
    transform: translateY(3px);

    .van-icon {
      margin-right: 3px;
      transform: translateY(1px);
    }
  }
}
</style>

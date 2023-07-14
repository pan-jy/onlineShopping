<template>
  <div>
    <van-cell-group class="cell-group" inset v-if="address">
      <div class="address" @click="router.push('/address-list')">
        <div class="detail">
          <van-text-ellipsis
            class="detail-address"
            rows="2"
            :content="address.address"
          />
          <div>
            <span class="detail-name">收货人：{{ address.userName }}</span>
            <span class="detail-phone">{{ address.phoneNumber }}</span>
          </div>
        </div>
        <div class="arrow">
          <van-icon name="arrow" />
        </div>
      </div>
    </van-cell-group>

    <van-cell-group class="cell-group" inset>
      <van-card
        :key="commodity.id"
        :num="commodity.count"
        :price="commodity.price"
        :desc="commodity.businessName"
        :title="commodity.tradeName"
        :thumb="commodity.covers"
        @clickThumb="
          router.push({
            path: '/commodity-detail',
            query: { id: commodity.commodityId }
          })
        "
        laze-load
      >
        <template #price>
          <span class="info-price">
            <span style="font-size: 0.8rem">￥</span>
            <span>{{ commodity.price }}</span>
          </span>
        </template>
        <template #tags>
          <van-tag plain type="primary" style="margin-right: 5px">
            七天无理由退货
          </van-tag>
          <van-tag plain type="primary">急速退款</van-tag>
        </template>
        <template #num>
          <van-stepper
            v-model="commodity.count"
            integer
            :before-change="changeNum(commodity.commodityId)"
          />
        </template>
      </van-card>
      <van-cell is-link style="color: #999" title="订单备注">
        <template #value>无备注</template>
      </van-cell>
      <van-cell is-link @click="showService = true">
        <template #title>
          <div style="display: flex; align-items: center">
            <p style="color: #999">服务</p>
            <p class="service">
              支持七天无理由退货 · 部分地区无法配送 · 退货运费险
            </p>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <van-action-sheet
      v-model:show="showService"
      cancel-text="我知道了"
      title="服务"
    >
      <div class="service-content">
        <p class="service-title">支持七天无理由退货</p>
        <p class="service-desc">
          满足7天无理由退换货申请的前提下，包邮商品需要买家承担退货邮费，非包邮商品需要买家承担发货和退货邮费。
        </p>
        <p class="service-title">部分地区无法配送</p>
        <p class="service-desc">港澳台地区无法配送</p>
        <p class="service-title">退货运费险</p>
        <p class="service-desc">
          卖家投保退货运费险，负担一定金额退货运费（保单生效以下单显示为准）
        </p>
      </div>
    </van-action-sheet>
    <van-submit-bar :price="commodity.price * 100" button-text="提交订单" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ShoppingCart } from '@/types/commodity'
import { useRouter } from 'vue-router'
import { updateShoppingCartCount } from '@/request/apis/user'
import { useBaseStore } from '@/store/baseStore'

const router = useRouter()
const baseStore = useBaseStore()
const address = ref(baseStore.curAddress)

const showService = ref(false)

const commodity = ref<ShoppingCart>({} as ShoppingCart)

onMounted(() => {
  commodity.value = JSON.parse(
    localStorage.getItem('PendingSettlement') ?? '{}'
  )
})

function changeNum(commodityId: string) {
  return async (count: number) => {
    if (count === 0) {
      return Promise.resolve(false)
    }
    if (!count) {
      return Promise.resolve(true)
    }
    try {
      await updateShoppingCartCount(commodityId, count)
      return Promise.resolve(true)
    } catch {
      return Promise.resolve(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.van-card {
  background-color: #fff;
}
.cell-group {
  box-sizing: border-box;
  width: 98vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin-top: 10px;
  padding: 0;
}

.service {
  width: 83%;
  font-size: 0.8rem;
  color: #000;
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &-content {
    padding: 15px;
  }

  &-title {
    font-size: 15px;
    margin-bottom: 5px;
  }

  &-desc {
    color: #999;
    font-size: 0.7rem;
    margin-bottom: 20px;
  }
}

.address {
  display: flex;

  .detail {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    box-sizing: border-box;
    padding: 10px 20px;

    &-address {
      margin-bottom: 5px;
    }

    &-name,
    &-phone {
      font-size: 0.8rem;
      color: #666;
    }

    &-phone {
      margin-left: 15px;
    }
  }

  .arrow {
    width: 20px;
    margin-right: 10px;
    display: flex;
    align-items: center;
  }
}
</style>

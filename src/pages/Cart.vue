<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-swipe-cell
        v-for="(commodity, index) in shoppingCartList"
        :before-close="beforeClose(commodity.commodityId, index)"
      >
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
        <template #left>
          <van-button
            square
            text="删除"
            type="warning"
            class="swiper-cell-button"
          />
        </template>
        <template #right>
          <van-button
            square
            text="结算"
            type="primary"
            class="swiper-cell-button"
          />
        </template>
      </van-swipe-cell>

      <van-empty
        v-show="!refreshing && shoppingCartList.length === 0"
        description="购物车还是空的~"
      >
        <van-button
          round
          size="small"
          plain
          type="default"
          class="bottom-button"
          to="/home"
        >
          去逛逛 >
        </van-button>
        <template #image>
          <img src="@/assets/emptyCart.svg" alt="empty-cart" />
        </template>
      </van-empty>
      <Recommend :recommendList="recommendList" />
    </van-pull-refresh>
    <van-back-top bottom="90px" right="10px" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getCommodityList, getShoppingCart } from '@/request/apis/commodity'
import {
  deleteShoppingCart,
  updateShoppingCartCount
} from '@/request/apis/user'
import { Commodity, ShoppingCart } from '@/types/commodity'
import { onMounted, ref } from 'vue'
import { showConfirmDialog } from 'vant'

const router = useRouter()

const refreshing = ref(true)
// 购物车列表
const shoppingCartList = ref<ShoppingCart[]>([])
// 推荐列表
const recommendList = ref<Commodity[]>([])

function beforeClose(commodityId: string, index: number) {
  return function ({ position }: { position: string }) {
    if (position === 'left') {
      return showConfirmDialog({
        title: '提示',
        message: '确认删除该商品吗？',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
        .then(async () => {
          try {
            await deleteShoppingCart(commodityId)
            shoppingCartList.value.splice(index, 1)
            return true
          } catch {
            return false
          }
        })
        .catch(() => {
          return true
        })
    } else if (position === 'right') {
      // router.push({
      //   path: '/settlement',
      //   query: { commodityId, id: shoppingCartList.value[index].id }
      // })
      localStorage.setItem(
        'PendingSettlement',
        JSON.stringify(shoppingCartList.value[index])
      )
      router.push('/settlement')
    }
  }
}

async function onRefresh() {
  getCommodityList(10).then((data) => {
    recommendList.value = data
  })
  getShoppingCart().then((data) => {
    shoppingCartList.value = data
    refreshing.value = false
  })
}

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

onMounted(() => {
  onRefresh()
})
</script>

<style lang="scss" scoped>
.van-empty {
  background-color: #fff;
}
.van-nav-bar {
  position: sticky;
  top: 0;
  z-index: 99;
}

.info-price {
  font-size: 1.1rem;
  color: #f22;
  font-weight: bold;
  margin-bottom: 6px;
}
.bottom-button {
  color: #333;
  padding: 0 20px;
}

.swiper-cell-button {
  height: 100%;
}
</style>

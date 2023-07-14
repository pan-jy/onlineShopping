<template>
  <div class="detail">
    <van-tabs scrollspy sticky ref="scrollTabs">
      <van-tab title="商品">
        <van-swipe style="height: 40vh">
          <van-swipe-item
            v-for="img in [
              commodityDetail.covers,
              ...(commodityDetail.images?.map((item) => item.images) ?? [])
            ]"
            :key="img"
          >
            <van-image width="100%" height="100%" :src="img" lazy-load />
          </van-swipe-item>
          <template #indicator="{ active, total }">
            <div class="custom-indicator">{{ active + 1 }} / {{ total }}</div>
          </template>
        </van-swipe>
        <van-cell-group class="info" inset>
          <span class="info-price">
            <span style="font-size: 1rem">￥</span>
            <span>{{ commodityDetail.price }}</span>
          </span>
          <van-text-ellipsis
            class="info-name"
            rows="2"
            :content="commodityDetail.tradeName"
          />
          <div class="info-num">
            <span>销量：{{ commodityDetail.sales }}</span>
            <span>库存：{{ commodityDetail.stock }}</span>
          </div>
        </van-cell-group>

        <van-cell-group class="info action" inset>
          <van-cell
            is-link
            style="color: #999"
            title="选择"
            @click="setSelect(0)"
          />
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
      </van-tab>
      <van-tab title="详情">
        <van-divider
          :style="{
            color: '#666',
            borderColor: '#666',
            padding: '0 25%'
          }"
        >
          商品详情
        </van-divider>
        <van-image
          v-for="item in commodityDetail.details"
          :key="item.id"
          width="100%"
          :src="item.details"
          lazy-load
        />
      </van-tab>
      <van-tab title="推荐">
        <Recommend :recommendList="recommendList" />
      </van-tab>
      <template #nav-left>
        <van-icon
          class="tabs-icon tabs-icon-back"
          name="arrow-left"
          @click="router.back()"
        />
      </template>
      <template #nav-right>
        <van-icon
          class="tabs-icon tabs-icon-share"
          name="share-o"
          @click="showShare = true"
        />
      </template>
    </van-tabs>
    <van-action-bar>
      <van-action-bar-icon icon="shop-o" text="店铺" />
      <van-action-bar-icon icon="cart-o" text="购物车" to="/cart" />
      <van-action-bar-button
        color="#00b3f9"
        type="warning"
        text="加入购物车"
        @click="setSelect(-1)"
      />
      <van-action-bar-button
        color="#0084fe"
        type="danger"
        text="立即购买"
        @click="setSelect(1)"
      />
    </van-action-bar>

    <van-share-sheet
      v-model:show="showShare"
      title="立即分享给好友"
      :options="options"
    />

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

    <van-action-sheet v-model:show="showSelect">
      <div class="select-content">
        <section class="select-content-header">
          <van-image
            width="20vw"
            height="12vh"
            :src="commodityDetail.covers"
            lazy-load
          />
          <span class="info-price">
            <span style="font-size: 1rem; margin-left: 15px">￥</span>
            <span>{{ commodityDetail.price }}</span>
          </span>
        </section>

        <section class="select-body">
          <div class="select-body-count">
            <span>数量</span>
            <van-stepper theme="round" v-model="count" />
          </div>
        </section>
      </div>

      <div class="select-buttons">
        <van-button
          v-show="showBtns === 0 || showBtns === -1"
          :class="{ 'select-button__only': showBtns === -1 }"
          class="select-button"
          color="#00b3f9"
          type="warning"
          text="加入购物车"
          round
          @click="addCart"
        />
        <van-button
          v-show="showBtns === 0 || showBtns === 1"
          :class="{ 'select-button__only': showBtns === 1 }"
          class="select-button"
          color="#0084fe"
          type="danger"
          text="立即购买"
          round
          @click="buyNow"
        />
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
import { LocationQueryValue, useRoute, useRouter } from 'vue-router'
import {
  getCommodityDetailById,
  getCommodityList
} from '@/request/apis/commodity'
import { addShoppingCart } from '@/request/apis/user'
import { ref, watch } from 'vue'
import { Commodity, CommodityDetail } from '@/types/commodity'
import type { TabsInstance } from 'vant'
import { showNotify } from 'vant'

// 路由
const route = useRoute()
const router = useRouter()
// 商品详情
const commodityDetail = ref<CommodityDetail>({} as CommodityDetail)
const scrollTabs = ref<TabsInstance>()
// 推荐列表
const recommendList = ref<Commodity[]>([])
function getRecommendList() {
  getCommodityList(10).then((data) => {
    recommendList.value = data
  })
}
// 选择面板
const showSelect = ref(false)
const showBtns = ref<-1 | 0 | 1>(0) // -1显示加入购物车，0都显示，1显示立即购买
const count = ref(1)
function setSelect(type: -1 | 0 | 1) {
  showBtns.value = type
  showSelect.value = true
}
// 服务详情面板
const showService = ref(false)
const showShare = ref(false)
const options = [
  [
    { name: '微信', icon: 'wechat' },
    { name: '朋友圈', icon: 'wechat-moments' },
    { name: '微博', icon: 'weibo' },
    { name: 'QQ', icon: 'qq' }
  ],
  [
    { name: '复制链接', icon: 'link' },
    { name: '分享海报', icon: 'poster' },
    { name: '二维码', icon: 'qrcode' },
    { name: '小程序码', icon: 'weapp-qrcode' }
  ]
]

// 监听query变化重新获取数据
let id: string | undefined // 商品id
watch(
  route,
  async () => {
    id = getId(route.query.id)
    if (!id) return
    scrollTabs.value?.scrollTo(0)
    getRecommendList()
    commodityDetail.value = await getDetail(id)
  },
  {
    immediate: true
  }
)

function getId(id: LocationQueryValue | LocationQueryValue[]) {
  if (Array.isArray(id)) id = id[0]
  if (id == null) return
  return id
}

async function addCart() {
  if (!id) return
  await addShoppingCart(id, count.value)
  showSelect.value = false
  showNotify({ type: 'success', message: '添加成功' })
}

function buyNow() {
  if (!id) return

  localStorage.setItem(
    'PendingSettlement',
    JSON.stringify({
      ...commodityDetail.value,
      count: count.value
    })
  )
  router.push('/settlement')
  showSelect.value = false
}

async function getDetail(id: string) {
  return await getCommodityDetailById(id)
}
</script>

<style lang="scss" scoped>
.tabs-icon {
  // font-size: 20px;
  color: #1989fa;
  height: 100%;
  display: flex;
  align-items: center;

  &-back {
    margin: 0 22vw 0 10px;
  }

  &-share {
    margin: 0 10px 0 22vw;
  }
}

.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 10px;
  padding: 2px 8px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  color: white;
  text-align: center;
}

.info {
  box-sizing: border-box;
  width: 98vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin-top: 10px;
  padding: 15px;

  &-price {
    font-size: 1.6rem;
    color: #f22;
    font-weight: bold;
    margin-bottom: 6px;
  }

  &-name {
    font-weight: bold;
    background-color: transparent;
    margin: 0;
    padding: 0;
    color: #111;
    font-size: 1rem;
    margin-bottom: 6px;
  }

  &-num {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8rem;
  }
}

.action {
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

.select-content {
  height: 70vh;
  box-sizing: border-box;
  padding: 16px;
  display: flex;
  flex-direction: column;

  &-header {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
  }
}

.select-body {
  &-count {
    display: flex;
    justify-content: space-between;

    span {
      font-weight: bold;
    }
  }
}

.select-buttons {
  display: flex;
  justify-content: space-evenly;
  padding-bottom: 10px;
}

.select-button {
  width: 43%;

  &__only {
    width: 96%;
  }
}
</style>

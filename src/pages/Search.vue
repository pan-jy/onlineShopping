<template>
  <div class="search">
    <van-search
      show-action
      autofocus
      clearable
      v-model="keyWord"
      placeholder="请输入搜索关键词"
      @search="search"
      @focus="isFocus = true"
    >
      <template #left>
        <van-button class="btn-back" size="mini" icon="arrow-left" to="/home" />
      </template>
      <template #action>
        <div @click="search">搜索</div>
      </template>
    </van-search>

    <div class="history" v-show="isFocus">
      <div class="history-header">
        <div class="header-title">搜索历史</div>
        <div class="header-clear" @click="history.splice(0)">
          <van-icon name="delete-o" />
          清空
        </div>
      </div>
      <div class="history-list">
        <van-tag
          class="history-item"
          v-for="item in history"
          plain
          :key="item"
          round
          color="#ccc"
          text-color="#333"
          @click="historyClick(item)"
        >
          {{ item }}
        </van-tag>
      </div>
    </div>
    <div class="result" v-show="!isFocus">
      <van-dropdown-menu ref="dropdownMenu">
        <van-dropdown-item
          v-model="sortValue"
          :options="sortOptions"
          @change="setSort"
        />
        <van-dropdown-item title="筛选" ref="itemRef">
          <section class="filter">
            <h5 class="filter-title">价格区间（元）</h5>
            <div class="filter-form">
              <van-field
                class="filter-input"
                type="number"
                v-model="filterValue.min"
                placeholder="最低价"
              />
              <span class="link-line"></span>
              <van-field
                class="filter-input"
                type="number"
                v-model="filterValue.max"
                placeholder="最高价"
              />
            </div>
            <van-button
              class="filter-button"
              round
              type="primary"
              @click="setFilter"
            >
              完成
            </van-button>
          </section>
        </van-dropdown-item>
      </van-dropdown-menu>

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
          <CommodityCard
            class="commodity"
            v-for="commodity in showList"
            :key="commodity.id"
            :commodity="commodity"
          />
        </div>
      </van-list>
    </div>
    <van-empty
      v-show="!isFocus && !loading && showList.length === 0 && !error"
      image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
      image-size="80"
      style="margin-top: 50px"
      description="换个关键词试试吧~"
    />
    <van-back-top bottom="30px" right="10px" />
  </div>
</template>

<script setup lang="ts">
import { searchCommodityByKeyword } from '@/request/apis/commodity'
import { Commodity } from '@/types/commodity'
import { DropdownMenuInstance } from 'vant'
import { onBeforeUnmount, reactive, ref } from 'vue'

const keyWord = ref('')
const isFocus = ref(true)
const history = ref<string[]>([])
history.value = JSON.parse(localStorage.getItem('searchHistory') || '[]')
const loading = ref(false)
const finished = ref(false)
const error = ref(false)
const commodityList: Array<Commodity> = []
const filteredList = ref<Array<Commodity>>([])
const showList: Array<Commodity> = reactive([])

const dropdownMenu = ref<DropdownMenuInstance>()
const sortOptions = [
  { text: '综合排序', value: 0 },
  { text: '销量优先', value: 1 },
  { text: '价低优先', value: 2 },
  { text: '价高优先', value: 3 }
]
const sortValue = ref(0)
const filterValue = reactive({
  min: '',
  max: ''
})

async function search() {
  if (!keyWord.value) return
  isFocus.value = false
  showList.splice(0)
  if (!history.value.includes(keyWord.value)) {
    history.value.push(keyWord.value)
  }
  const data = await searchCommodityByKeyword(keyWord.value)
  commodityList.splice(0, commodityList.length, ...data)
  filteredList.value = commodityList
  onLoad()
}

function historyClick(item: string) {
  keyWord.value = item
  search()
}

function setSort() {
  switch (sortValue.value) {
    case 0:
      filteredList.value.sort(() => Math.random() - 0.5)
      break
    case 1:
      filteredList.value.sort((a, b) => b.sales - a.sales)
      break
    case 2:
      filteredList.value.sort((a, b) => a.price - b.price)
      break
    case 3:
      filteredList.value.sort((a, b) => b.price - a.price)
      break
  }
  showList.splice(0)
  onLoad()
}

function setFilter() {
  filteredList.value = commodityList.filter((item: Commodity) => {
    if (filterValue.min && filterValue.max) {
      return (
        item.price >= Number(filterValue.min) &&
        item.price <= Number(filterValue.max)
      )
    } else if (filterValue.min) {
      return item.price >= Number(filterValue.min)
    } else if (filterValue.max) {
      return item.price <= Number(filterValue.max)
    } else {
      return true
    }
  })
  showList.splice(0)
  onLoad()
  if (dropdownMenu.value) dropdownMenu.value.close()
}

const onLoad = () => {
  if (filteredList.value.length === 0) return
  showList.push(...filteredList.value.splice(showList.length, 10))
  if (showList.length >= filteredList.value.length) finished.value = true
  loading.value = false
}

onBeforeUnmount(() => {
  localStorage.setItem('searchHistory', JSON.stringify(history.value))
})
</script>

<style lang="scss" scoped>
.van-search {
  padding-left: 0;
}

.btn-back {
  margin-right: 1vw;
  border: none;
  font-size: 1rem;
}

.history {
  display: flex;
  flex-direction: column;
  padding: 10px;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 10px;

    .header-title {
      font-weight: bold;
    }
  }

  &-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }

  &-item {
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: .4rem 1.2rem;
    max-width: 20vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: .7rem;
  }
}

.commodity-list {
  animation: zoomInUp 0.5s ease-in 0s 1 forwards;
  padding: 0 2%;
}
.commodity {
  margin-top: 1vh;
  &:nth-child(odd) {
    margin-right: 2%;
  }
}

.van-search {
  position: sticky;
  top: 0;
  z-index: 99;
}

.filter {
  display: flex;
  flex-direction: column;
  padding: 15px 20px;

  &-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
  }

  &-input {
    display: inline-flex;
    width: 45%;
    border-radius: 30px;
    padding: 2px 10px;
    background-color: #eee;
  }

  &-button {
    margin-top: 15px;
    height: 36px;
  }

  .link-line {
    width: 5%;
    height: 1px;
    background-color: #000;
  }
}
</style>

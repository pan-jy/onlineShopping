<template>
  <div>
    <van-address-edit
      :address-info="addressInfo"
      :area-list="areaList"
      show-search-result
      show-delete
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
      :is-saving="isSaving"
      :is-deleting="isDeleting"
    />
  </div>
</template>

<script setup lang="ts">
import { areaList } from '@vant/area-data'
import { ref } from 'vue'
import { useBaseStore } from '@/store/baseStore'
import { useRouter } from 'vue-router'
import { deleteAddress } from '@/request/apis/user'

const router = useRouter()

const baseStore = useBaseStore()
const curAddress = baseStore.curAddress!
// 用正则分别获取 "浙江省杭州市西湖区文三路138号东方通信大厦7楼501室" 中的省、市、区、详细地址
const addressArr = curAddress.address.match(
  /(.+?(省|自治区|自治州))(.+?(市))(.+?(区|县))(.+)/
)!

const isSaving = ref(false)
const isDeleting = ref(false)

const addressInfo = {
  name: curAddress.userName,
  tel: curAddress.phoneNumber,
  province: addressArr[1],
  city: addressArr[3],
  county: addressArr[5],
  addressDetail: addressArr[7]
}

const onSave = () => {
  isSaving.value = true
  setTimeout(() => {
    isSaving.value = false
    router.back()
  }, 500)
}
const onDelete = async () => {
  isDeleting.value = true
  await deleteAddress(curAddress.id + '')
  isDeleting.value = false
  router.back()
}
</script>

<style lang="scss" scoped></style>

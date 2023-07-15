<template>
  <div class="address-list">
    <van-address-list
      v-model="chosenAddressId"
      :list="showList"
      default-tag-text="默认"
      @add="onAdd"
      @edit="onEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getAddressList } from '@/request/apis/user'
import { Address } from '@/types/user'
import { useBaseStore } from '@/store/baseStore'
import { useRouter } from 'vue-router'

const addressList = ref<Address[]>([])
const chosenAddressId = ref(0)
const router = useRouter()

const baseStore = useBaseStore()

getAddressList().then((data) => {
  addressList.value = data
  baseStore.addressList = data
  if (baseStore.curAddress) {
    chosenAddressId.value = baseStore.curAddress.id
    return
  }
  chosenAddressId.value = data[0].id
  baseStore.curAddress = data[0]
})

const showList = computed(() => {
  return addressList.value.map((address, index) => {
    return {
      id: address.id,
      name: address.userName,
      tel: address.phoneNumber,
      address: address.address,
      isDefault: index === 0
    }
  })
})

watch(
  () => chosenAddressId.value,
  (val) => {
    baseStore.curAddress = addressList.value.find(
      (address) => address.id === val
    )
  }
)

const onAdd = () => {
  router.push('/add-address')
}
const onEdit = ({ id }: { id: number }) => {
  chosenAddressId.value = id
  router.push('/edit-address')
}
</script>

<style lang="scss" scoped></style>

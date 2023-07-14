import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Address } from '@/types/user'

export const useBaseStore = defineStore('baseStore', () => {
  const addressList = ref<Address[]>([])
  const curAddress = ref<Address | undefined>()

  return {
    addressList,
    curAddress
  }
})

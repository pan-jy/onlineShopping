import axios from '../config'
import type {
  Commodity,
  CommodityDetail,
  ShoppingCart
} from '@/types/commodity'

async function getCommodityList(num: number): Promise<Commodity[]> {
  const res = await axios.get(`/commodity/getRandomTradeByNumber/${num}`)
  return res.data
}

async function getCommodityDetailById(id: string): Promise<CommodityDetail> {
  const res = await axios.post(
    `/commodity/getTradeMessageUseFuzzyMatchingById/${id}`
  )
  return res.data
}

async function searchCommodityByKeyword(keyword: string) {
  const res = await axios.get(
    `/commodity/getTradeMessageUseFuzzyMatchingByName/${keyword}`
  )
  return res.data
}

async function getShoppingCart(): Promise<ShoppingCart[]> {
  const res = await axios.post('/user/shoppingTrolley/showUserShoppingTrolley')
  return res.data
}

export {
  getCommodityList,
  getCommodityDetailById,
  searchCommodityByKeyword,
  getShoppingCart
}

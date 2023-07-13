import axios from '../config'
import type { Commodity, CommodityDetail } from '@/types/commodity'

async function getCommodityList(num: number): Promise<Commodity[]> {
  const res = await axios.get(`/commodity/getRandomTradeByNumber/${num}`)
  return res.data
}

async function getCommodityDetailById(id: number): Promise<CommodityDetail> {
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

export { getCommodityList, getCommodityDetailById, searchCommodityByKeyword }

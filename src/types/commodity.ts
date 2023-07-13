type Commodity = {
  id: number
  businessName: string
  covers: string
  merchantId: string
  price: number
  sales: number
  stock: number
  tradeName: string
}

type CommodityDetail = {
  id: number
  businessName: string
  covers: string
  details: Array<{
    id: number
    commodityId: number
    details: string
  }>
  images: Array<{
    id: number
    commodityId: number
    images: string
  }>
  merchantId: string
  price: number
  sales: number
  stock: number
  tradeName: string
}

export type { Commodity, CommodityDetail }

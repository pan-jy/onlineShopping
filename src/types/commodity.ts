interface Commodity {
  id: number
  businessName: string
  covers: string
  merchantId: string
  price: number
  sales: number
  stock: number
  tradeName: string
}

interface CommodityDetail extends Commodity {
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
}

interface ShoppingCart extends Commodity {
  commodityId: string
  count: number
  userId: string
}

interface ViewRecord extends Commodity {
  lastTime: string
}

export type { Commodity, CommodityDetail, ShoppingCart, ViewRecord }

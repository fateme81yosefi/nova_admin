export type Product = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  local?: boolean
  rating?: {
    rate: number
    count: number
  }
}

export type ProductPayload = {
  title: string
  price: number
  description: string
  category: string
  image: string
}

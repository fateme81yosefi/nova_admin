import type { Product, ProductPayload } from '@/types/product'
import { api } from '@/Utils/api/axiosInstance'

export async function getProducts() {
  const { data } = await api.get<Product[]>('/products')
  return data
}

export async function getCategories() {
  const { data } = await api.get<string[]>('/products/categories')
  return data
}

export async function createProduct(payload: ProductPayload) {
  const { data } = await api.post<Product>('/products', payload)
  return {
    ...payload,
    ...data,
    id: data.id ?? Date.now(),
  }
}

export async function updateProduct(id: number, payload: ProductPayload) {
  const { data } = await api.put<Product>(`/products/${id}`, payload)
  return {
    ...payload,
    ...data,
    id,
  }
}

export async function deleteProduct(id: number) {
  await api.delete(`/products/${id}`)
}

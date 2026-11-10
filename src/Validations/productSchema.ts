import * as yup from 'yup'
import type { Dictionary } from '@/Dictionary/fa'

export type ProductFormValues = {
  title: string
  description: string
  price: string
  category: string
  image: string
}

export function productSchema(text: Dictionary['validation']) {
  return yup.object({
    title: yup.string().trim().required(text.required).min(3, text.min3),
    description: yup.string().trim().required(text.required).min(10, text.min10),
    price: yup
      .string()
      .trim()
      .required(text.required)
      .test('number', text.number, (value) => value !== undefined && value !== '' && Number.isFinite(Number(value)))
      .test('positive', text.positive, (value) => Number(value) > 0),
    category: yup.string().required(text.required),
    image: yup.string().trim().required(text.required).url(text.url),
  })
}

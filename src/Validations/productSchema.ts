import * as yup from 'yup'
import type { Dictionary } from '@/Dictionary/fa'
import { parseLocalizedNumber } from '@/Utils/localizeDigits'
import { isImageSource } from '@/Utils/isHttpUrl'

export type ProductFormValues = {
  title: string
  price: string
  category: string
  image: string
  localImage: string
}

export function productSchema(text: Dictionary['validation']) {
  return yup.object({
    title: yup.string().trim().required(text.required).min(3, text.min3),
    price: yup
      .string()
      .trim()
      .required(text.required)
      .test('number', text.number, (value) => value != null && Number.isFinite(parseLocalizedNumber(value)))
      .test('positive', text.positive, (value) => parseLocalizedNumber(value ?? '') > 0),
    category: yup.string().required(text.required),
    image: yup
      .string()
      .trim()
      .test('image', text.url, function (value) {
        const localImage = String((this.parent as ProductFormValues).localImage ?? '')
        if (localImage.startsWith('data:image/')) return true
        if (!value) return this.createError({ message: text.required })
        if (!isImageSource(value)) return this.createError({ message: text.url })
        return true
      }),
  })
}

export type ProductEditValues = {
  title: string
  description: string
  price: string
  category: string
  image: string
}

export function productEditSchema(text: Dictionary['validation']) {
  return yup.object({
    title: yup.string().trim().required(text.required).min(3, text.min3),
    description: yup.string().trim().required(text.required).min(10, text.min10),
    price: yup
      .string()
      .trim()
      .required(text.required)
      .test('number', text.number, (value) => value != null && Number.isFinite(parseLocalizedNumber(value)))
      .test('positive', text.positive, (value) => parseLocalizedNumber(value ?? '') > 0),
    category: yup.string().required(text.required),
    image: yup
      .string()
      .trim()
      .required(text.required)
      .test('url', text.url, (value) => Boolean(value && isImageSource(value))),
  })
}

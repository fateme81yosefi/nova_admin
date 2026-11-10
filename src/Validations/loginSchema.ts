import * as yup from 'yup'
import type { Dictionary } from '@/Dictionary/fa'

export type LoginFormValues = {
  username: string
  password: string
}

export function loginSchema(text: Dictionary['validation']) {
  return yup.object({
    username: yup.string().trim().required(text.required).min(3, text.min3),
    password: yup.string().required(text.required).min(4, text.min4),
  })
}

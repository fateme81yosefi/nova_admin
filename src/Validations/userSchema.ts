import * as yup from 'yup'
import type { Dictionary } from '@/Dictionary/fa'

export type UserFormValues = {
  firstname: string
  lastname: string
  username: string
  email: string
  password: string
  phone: string
}

export function userSchema(text: Dictionary['validation']) {
  return yup.object({
    firstname: yup.string().trim().required(text.required).min(2, text.min3),
    lastname: yup.string().trim().required(text.required).min(2, text.min3),
    username: yup
      .string()
      .trim()
      .required(text.required)
      .min(3, text.min3)
      .matches(/^[a-zA-Z0-9._-]+$/, text.username),
    email: yup.string().trim().required(text.required).email(text.email),
    password: yup.string().required(text.required).min(6, text.min6),
    phone: yup
      .string()
      .trim()
      .required(text.required)
      .matches(/^[0-9+\-()\s]{6,}$/, text.phone),
  })
}

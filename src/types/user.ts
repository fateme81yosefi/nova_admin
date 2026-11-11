export type UserName = {
  firstname: string
  lastname: string
}

export type UserAddress = {
  city: string
  street: string
  number: number | null
  zipcode: string
}

export type User = {
  id: number
  email: string
  username: string
  phone: string
  name: UserName
  address: UserAddress | null
  local?: boolean
}

export type UserPayload = {
  email: string
  username: string
  password: string
  phone: string
  firstname: string
  lastname: string
}

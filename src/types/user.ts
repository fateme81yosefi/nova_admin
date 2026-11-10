export type UserName = {
  firstname: string
  lastname: string
}

export type User = {
  id: number
  email: string
  username: string
  phone: string
  name: UserName
}

export type UserPayload = {
  email: string
  username: string
  password: string
  phone: string
  firstname: string
  lastname: string
}

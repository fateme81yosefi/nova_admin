import type { User, UserAddress, UserPayload } from '@/types/user'
import { api } from '@/Utils/api/axiosInstance'

type UserResponse = {
  id: number
  email?: string
  username?: string
  phone?: string
  password?: string
  local?: boolean
  name?: {
    firstname?: string
    lastname?: string
  }
  address?: {
    city?: string
    street?: string
    number?: number
    zipcode?: string
  }
}

export async function getUsers() {
  const { data } = await api.get<UserResponse[]>('/users')
  return data.map(normalizeUser)
}

export async function createUser(payload: UserPayload) {
  const body = {
    email: payload.email,
    username: payload.username,
    password: payload.password,
    phone: payload.phone,
    name: {
      firstname: payload.firstname,
      lastname: payload.lastname,
    },
  }

  const { data } = await api.post<UserResponse>('/users', body)
  return normalizeUser({
    ...body,
    ...data,
    id: data.id ?? Date.now(),
    local: true,
  })
}

export async function updateUser(id: number, payload: Omit<UserPayload, 'password'>) {
  const body = {
    email: payload.email,
    username: payload.username,
    phone: payload.phone,
    name: {
      firstname: payload.firstname,
      lastname: payload.lastname,
    },
  }
  const { data } = await api.put<UserResponse>(`/users/${id}`, body)
  return normalizeUser({
    ...body,
    ...data,
    id,
  })
}

export async function deleteUser(id: number) {
  await api.delete(`/users/${id}`)
}

function normalizeUser(user: UserResponse): User {
  return {
    id: user.id,
    email: user.email ?? '',
    username: user.username ?? '',
    phone: user.phone ?? '',
    local: user.local,
    name: {
      firstname: user.name?.firstname ?? '',
      lastname: user.name?.lastname ?? '',
    },
    address: readAddress(user.address),
  }
}

function readAddress(address: UserResponse['address']): UserAddress | null {
  if (!address) return null
  const city = address.city ?? ''
  const street = address.street ?? ''
  const zipcode = address.zipcode ?? ''
  const number = typeof address.number === 'number' ? address.number : null
  if (!city && !street && !zipcode && number === null) return null
  return { city, street, number, zipcode }
}

import type { User, UserPayload } from '@/types/user'
import { api } from '@/Utils/api/axiosInstance'

type UserResponse = User & {
  password?: string
  name?: User['name']
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
  })
}

function normalizeUser(user: UserResponse): User {
  return {
    id: user.id,
    email: user.email ?? '',
    username: user.username ?? '',
    phone: user.phone ?? '',
    name: {
      firstname: user.name?.firstname ?? '',
      lastname: user.name?.lastname ?? '',
    },
  }
}

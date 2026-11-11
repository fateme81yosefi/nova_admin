import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RequestStatus } from '@/types/Enums/requestStatus'
import type { User, UserPayload } from '@/types/user'
import { getErrorMessage } from '@/Utils/getErrorMessage'
import { createUser, deleteUser, getUsers, updateUser } from '@/Utils/services/userService'

type UsersState = {
  items: User[]
  status: RequestStatus
  error: string | null
  saving: boolean
  saveError: string | null
}

const initialState: UsersState = {
  items: [],
  status: RequestStatus.Idle,
  error: null,
  saving: false,
  saveError: null,
}

export const loadUsers = createAsyncThunk<User[], void, { state: { users: UsersState }; rejectValue: string }>(
  'users/load',
  async (_, { rejectWithValue }) => {
    try {
      return await getUsers()
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().users
      return status !== RequestStatus.Loading && status !== RequestStatus.Success
    },
  },
)

export const addUser = createAsyncThunk<User, UserPayload, { rejectValue: string }>(
  'users/add',
  async (payload, { rejectWithValue }) => {
    try {
      return await createUser(payload)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const saveUser = createAsyncThunk<
  User,
  { id: number; payload: Omit<UserPayload, 'password'>; local?: boolean },
  { rejectValue: string }
>('users/save', async ({ id, payload, local }, { rejectWithValue }) => {
  try {
    if (local) {
      return {
        id,
        local: true,
        email: payload.email,
        username: payload.username,
        phone: payload.phone,
        address: null,
        name: { firstname: payload.firstname, lastname: payload.lastname },
      }
    }
    const saved = await updateUser(id, payload)
    return { ...saved, id }
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const removeUser = createAsyncThunk<number, { id: number; local?: boolean }, { rejectValue: string }>(
  'users/remove',
  async ({ id, local }, { rejectWithValue }) => {
    try {
      if (!local) await deleteUser(id)
      return id
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserSaveError(state) {
      state.saveError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.status = RequestStatus.Loading
        state.error = null
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.status = RequestStatus.Success
        state.items = action.payload
      })
      .addCase(loadUsers.rejected, (state, action) => {
        if (action.meta.condition) return
        state.status = RequestStatus.Error
        state.error = action.payload ?? ''
      })
      .addCase(addUser.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.saving = false
        const id = state.items.some((item) => item.id === action.payload.id) ? Date.now() : action.payload.id
        state.items = [{ ...action.payload, id, local: true }, ...state.items]
      })
      .addCase(addUser.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload ?? ''
      })
      .addCase(saveUser.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      .addCase(saveUser.fulfilled, (state, action) => {
        state.saving = false
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload, address: item.address, local: item.local } : item,
        )
      })
      .addCase(saveUser.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload ?? ''
      })
      .addCase(removeUser.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.saving = false
        state.items = state.items.filter((item) => item.id !== action.payload)
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload ?? ''
      })
  },
})

export const { clearUserSaveError } = usersSlice.actions
export const usersReducer = usersSlice.reducer

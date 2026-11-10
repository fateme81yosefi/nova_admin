import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RequestStatus } from '@/types/Enums/requestStatus'
import type { User, UserPayload } from '@/types/user'
import { getErrorMessage } from '@/Utils/getErrorMessage'
import { createUser, getUsers } from '@/Utils/services/userService'

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
        state.items = [{ ...action.payload, id }, ...state.items]
      })
      .addCase(addUser.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload ?? ''
      })
  },
})

export const { clearUserSaveError } = usersSlice.actions
export const usersReducer = usersSlice.reducer

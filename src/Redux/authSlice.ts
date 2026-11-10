import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { clearSession, readSession, writeSession } from '@/Storage/localStore'
import type { LoginPayload } from '@/types/auth'
import { RequestStatus } from '@/types/Enums/requestStatus'
import { getErrorMessage } from '@/Utils/getErrorMessage'
import { loginRequest } from '@/Utils/services/authService'

type AuthState = {
  token: string | null
  username: string | null
  status: RequestStatus
  error: string | null
}

const session = readSession()

const initialState: AuthState = {
  token: session?.token ?? null,
  username: session?.username ?? null,
  status: RequestStatus.Idle,
  error: null,
}

export const login = createAsyncThunk<
  { token: string; username: string },
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const token = await loginRequest(payload)
    const nextSession = { token, username: payload.username }
    writeSession(nextSession)
    return nextSession
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.username = null
      state.status = RequestStatus.Idle
      state.error = null
      clearSession()
    },
    clearAuthError(state) {
      state.error = null
      state.status = RequestStatus.Idle
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = RequestStatus.Loading
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = RequestStatus.Success
        state.token = action.payload.token
        state.username = action.payload.username
      })
      .addCase(login.rejected, (state, action) => {
        state.status = RequestStatus.Error
        state.error = action.payload ?? ''
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export const authReducer = authSlice.reducer

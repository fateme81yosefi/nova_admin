import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './authSlice'
import { productsReducer } from './productsSlice'
import { uiReducer } from './uiSlice'
import { usersReducer } from './usersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    users: usersReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

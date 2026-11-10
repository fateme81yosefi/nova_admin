import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { readLanguage, readTheme, writeLanguage, writeTheme } from '@/Storage/localStore'
import { Language } from '@/types/Enums/language'
import { ThemeMode } from '@/types/Enums/theme'

type UiState = {
  theme: ThemeMode
  language: Language
}

const initialState: UiState = {
  theme: readTheme(),
  language: readLanguage(),
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload
      writeTheme(action.payload)
    },
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload
      writeLanguage(action.payload)
    },
  },
})

export const { setTheme, setLanguage } = uiSlice.actions
export const uiReducer = uiSlice.reducer

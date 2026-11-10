import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ProductCategory } from '@/types/Enums/productCategory'
import { RequestStatus } from '@/types/Enums/requestStatus'
import type { Product, ProductPayload } from '@/types/product'
import { getErrorMessage } from '@/Utils/getErrorMessage'
import { createProduct, getCategories, getProducts } from '@/Utils/services/productService'

type Catalog = {
  products: Product[]
  categories: string[]
}

type ProductsState = {
  items: Product[]
  categories: string[]
  status: RequestStatus
  error: string | null
  saving: boolean
  saveError: string | null
}

const initialState: ProductsState = {
  items: [],
  categories: [],
  status: RequestStatus.Idle,
  error: null,
  saving: false,
  saveError: null,
}

export const loadCatalog = createAsyncThunk<Catalog, void, { state: { products: ProductsState }; rejectValue: string }>(
  'products/load',
  async (_, { rejectWithValue }) => {
    try {
      const products = await getProducts()
      let categories: string[] = []
      try {
        categories = await getCategories()
      } catch {
        categories = [...new Set(products.map((item) => item.category))]
      }
      if (categories.length === 0) {
        categories = Object.values(ProductCategory)
      }
      return { products, categories }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().products
      return status !== RequestStatus.Loading && status !== RequestStatus.Success
    },
  },
)

export const addProduct = createAsyncThunk<Product, ProductPayload, { rejectValue: string }>(
  'products/add',
  async (payload, { rejectWithValue }) => {
    try {
      return await createProduct(payload)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductSaveError(state) {
      state.saveError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalog.pending, (state) => {
        state.status = RequestStatus.Loading
        state.error = null
      })
      .addCase(loadCatalog.fulfilled, (state, action) => {
        state.status = RequestStatus.Success
        state.items = action.payload.products
        state.categories = action.payload.categories
      })
      .addCase(loadCatalog.rejected, (state, action) => {
        if (action.meta.condition) return
        state.status = RequestStatus.Error
        state.error = action.payload ?? ''
      })
      .addCase(addProduct.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.saving = false
        // FakeStore برای هر POST همان id را برمی‌گرداند
        const id = state.items.some((item) => item.id === action.payload.id) ? Date.now() : action.payload.id
        state.items = [{ ...action.payload, id }, ...state.items]
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload ?? ''
      })
  },
})

export const { clearProductSaveError } = productsSlice.actions
export const productsReducer = productsSlice.reducer

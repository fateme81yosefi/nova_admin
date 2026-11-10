import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { AppProviders } from '@/App'
import '@/assets/Fonts/vazirmatn.css'
import { store } from '@/Redux/store'
import { router } from '@/Routes/AppRoutes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </Provider>
  </StrictMode>,
)

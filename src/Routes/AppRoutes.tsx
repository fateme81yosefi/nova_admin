import { Navigate, createBrowserRouter } from 'react-router-dom'
import { CreateUserPage } from '@/Pages/CreateUserPage'
import { DashboardPage } from '@/Pages/DashboardPage'
import { LoginPage } from '@/Pages/LoginPage'
import { ProductsPage } from '@/Pages/ProductsPage'
import { SettingsPage } from '@/Pages/SettingsPage'
import { UsersPage } from '@/Pages/UsersPage'
import { AdminLayout } from '@/Shared/AdminLayout'
import { RoutePath } from '@/types/Enums/routes'
import { RequireAuth } from './RequireAuth'

export const router = createBrowserRouter([
  {
    path: RoutePath.Login,
    element: <LoginPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: RoutePath.Dashboard, element: <DashboardPage /> },
          { path: RoutePath.Products, element: <ProductsPage /> },
          { path: RoutePath.CreateProduct, element: <Navigate to={RoutePath.Products} replace /> },
          { path: RoutePath.Users, element: <UsersPage /> },
          { path: RoutePath.CreateUser, element: <CreateUserPage /> },
          { path: RoutePath.Settings, element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={RoutePath.Dashboard} replace />,
  },
])
